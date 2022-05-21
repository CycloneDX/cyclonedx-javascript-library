import { isNotUndefined, Stringable } from '../../types'
import * as Models from '../../models'
import { Protocol as Spec, Version as SpecVersion } from '../../spec'
import { NormalizeOptions } from '../types'
import * as Types from './types'

export class Factory {
  readonly spec: Spec

  constructor (spec: Spec) {
    this.spec = spec
  }

  makeForBom (): BomNormalizer {
    return new BomNormalizer(this)
  }

  makeForMetadata (): MetadataNormalizer {
    return new MetadataNormalizer(this)
  }

  makeForComponent (): ComponentNormalizer {
    return new ComponentNormalizer(this)
  }

  makeForTool (): ToolNormalizer {
    return new ToolNormalizer(this)
  }

  makeForOrganizationalContact (): OrganizationalContactNormalizer {
    return new OrganizationalContactNormalizer(this)
  }

  makeForOrganizationalEntity (): OrganizationalEntityNormalizer {
    return new OrganizationalEntityNormalizer(this)
  }

  makeForHash (): HashNormalizer {
    return new HashNormalizer(this)
  }

  makeForLicense (): LicenseNormalizer {
    return new LicenseNormalizer(this)
  }

  makeForSWID (): SWIDNormalizer {
    return new SWIDNormalizer(this)
  }

  makeForExternalReference (): ExternalReferenceNormalizer {
    return new ExternalReferenceNormalizer(this)
  }

  makeForAttachment (): AttachmentNormalizer {
    return new AttachmentNormalizer(this)
  }

  makeForDependencyGraph (): DependencyGraphNormalizer {
    return new DependencyGraphNormalizer(this)
  }
}

const xmlNamespace: ReadonlyMap<SpecVersion, string> = new Map([
  [SpecVersion.v1dot2, 'http://cyclonedx.org/schema/bom/1.2'],
  [SpecVersion.v1dot3, 'http://cyclonedx.org/schema/bom/1.3'],
  [SpecVersion.v1dot4, 'http://cyclonedx.org/schema/bom/1.4']
])

interface Normalizer {
  normalize: (data: object, options: NormalizeOptions, elementName?: string) => object | undefined

  normalizeIter?: (data: Iterable<object>, options: NormalizeOptions, elementName: string) => object[]
}

abstract class Base implements Normalizer {
  protected readonly _factory: Factory

  constructor (factory: Factory) {
    this._factory = factory
  }

  /**
   * @param {*} data
   * @param {NormalizeOptions} options
   * @param {string} [elementName] element name. XML defines structures; the element's name is defined on usage of a structure.
   */
  abstract normalize (data: object, options: NormalizeOptions, elementName?: string): object | undefined
}

/* eslint-disable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions --
 * since empty strings need to be treated as undefined/null
 */

export class BomNormalizer extends Base {
  normalize (data: Models.Bom, options: NormalizeOptions, elementName: string = 'bom'): Types.SimpleXml.Element {
    return {
      type: 'element',
      name: elementName, // this one has a name defined in the structure
      attributes: {
        xmlns: xmlNamespace.get(this._factory.spec.version),
        version: data.version,
        serialNumber: data.serialNumber ?? undefined
      },
      children: [
        data.metadata
          ? this._factory.makeForMetadata().normalize(data.metadata, options, 'metadata')
          : undefined,
        {
          // spec < 1.4 always requires a 'components' element
          type: 'element',
          name: 'components',
          children: data.components.size > 0
            ? this._factory.makeForComponent().normalizeIter(data.components, options, 'component')
            : undefined
        },
        this._factory.spec.supportsDependencyGraph
          ? this._factory.makeForDependencyGraph().normalize(data, options, 'dependencies')
          : undefined
      ].filter(isNotUndefined) as Types.SimpleXml.Element[]// TODO remove type hint
    }
  }
}

export class MetadataNormalizer extends Base {
  normalize (data: Models.Metadata, options: NormalizeOptions, elementName: string): Types.SimpleXml.Element {
    const orgEntityNormalizer = this._factory.makeForOrganizationalEntity()
    return {
      type: 'element',
      name: elementName,
      children: [
        data.timestamp === null
          ? undefined
          : {
              type: 'element',
              name: 'timestamp',
              children: data.timestamp.toISOString()
            },
        data.tools.size > 0
          ? {
              type: 'element',
              name: 'tools',
              children: this._factory.makeForTool().normalizeIter(data.tools, options, 'tool')
            }
          : undefined,
        data.authors.size > 0
          ? {
              type: 'element',
              name: 'authors',
              children: this._factory.makeForOrganizationalContact().normalizeIter(data.authors, options, 'author')
            }
          : undefined,
        data.component === null
          ? undefined
          : this._factory.makeForComponent().normalize(data.component, options, 'component'),
        data.manufacture === null
          ? undefined
          : orgEntityNormalizer.normalize(data.manufacture, options, 'manufacture'),
        data.supplier === null
          ? undefined
          : orgEntityNormalizer.normalize(data.supplier, options, 'supplier')
      ].filter(isNotUndefined) as Types.SimpleXml.Element[]// TODO remove type hint
    }
  }
}

export class ToolNormalizer extends Base {
  normalize (data: Models.Tool, options: NormalizeOptions, elementName: string): Types.SimpleXml.Element {
    return {
      type: 'element',
      name: elementName,
      children: [
        normalizeStringableLax(data.vendor, 'vendor'),
        normalizeStringableLax(data.name, 'name'),
        normalizeStringableLax(data.version, 'version'),
        data.hashes.size > 0
          ? {
              type: 'element',
              name: 'hashes',
              children: this._factory.makeForHash().normalizeIter(data.hashes, options, 'hash')
            }
          : undefined
      ].filter(isNotUndefined) as Types.SimpleXml.Element[] // TODO remove type hint
    }
  }

  normalizeIter (data: Iterable<Models.Tool>, options: NormalizeOptions, elementName: string): Types.SimpleXml.Element[] {
    const tools = Array.from(data)
    if (options.sortLists) {
      tools.sort(Models.ToolRepository.compareItems)
    }
    return tools.map(t => this.normalize(t, options, elementName))
  }
}

export class HashNormalizer extends Base {
  normalize ([algorithm, content]: Models.Hash, options: NormalizeOptions, elementName: string): Types.SimpleXml.Element | undefined {
    const spec = this._factory.spec
    return spec.supportsHashAlgorithm(algorithm) && spec.supportsHashValue(content)
      ? {
          type: 'element',
          name: elementName,
          attributes: { hashAlg: algorithm },
          children: content
        }
      : undefined
  }

  normalizeIter (data: Iterable<Models.Hash>, options: NormalizeOptions, elementName: string): Types.SimpleXml.Element[] {
    const hashes = Array.from(data)
    if (options.sortLists) {
      hashes.sort(Models.HashRepository.compareItems)
    }
    return hashes.map(h => this.normalize(h, options, elementName))
      .filter(isNotUndefined)
  }
}

export class OrganizationalContactNormalizer extends Base {
  normalize (data: Models.OrganizationalContact, options: NormalizeOptions, elementName: string): Types.SimpleXml.Element {
    return {
      type: 'element',
      name: elementName,
      children: [
        normalizeStringableLax(data.name, 'name'),
        normalizeStringableLax(data.email, 'email'),
        normalizeStringableLax(data.phone, 'phone')
      ].filter(isNotUndefined)
    }
  }

  normalizeIter (data: Iterable<Models.OrganizationalContact>, options: NormalizeOptions, elementName: string): Types.SimpleXml.Element[] {
    const contacts = Array.from(data)
    if (options.sortLists) {
      contacts.sort(Models.OrganizationalContactRepository.compareItems)
    }
    return contacts.map(c => this.normalize(c, options, elementName))
  }
}

export class OrganizationalEntityNormalizer extends Base {
  normalize (data: Models.OrganizationalEntity, options: NormalizeOptions, elementName: string): Types.SimpleXml.Element {
    return {
      type: 'element',
      name: elementName,
      children: [
        normalizeStringableLax(data.name, 'name'),
        ...normalizeStringableIter(data.url, options, 'url')
          .filter(({ children: u }) => Types.XmlSchema.isAnyURI(u)),
        ...this._factory.makeForOrganizationalContact().normalizeIter(data.contact, options, 'contact')
      ].filter(isNotUndefined)
    }
  }
}

export class ComponentNormalizer extends Base {
  normalize (data: Models.Component, options: NormalizeOptions, elementName: string): Types.SimpleXml.Element | undefined {
    return this._factory.spec.supportsComponentType(data.type)
      ? {
          type: 'element',
          name: elementName,
          attributes: {
            type: data.type,
            'bom-ref': data.bomRef.value
          },
          children: [
            data.supplier === null
              ? undefined
              : this._factory.makeForOrganizationalEntity().normalize(data.supplier, options, 'supplier'),
            normalizeStringableLax(data.author, 'author'),
            normalizeStringableLax(data.publisher, 'publisher'),
            normalizeStringableLax(data.group, 'group'),
            normalizeStringable(data.name, 'name'),
            normalizeStringable(
              // version fallback to string for spec < 1.4
              data.version ?? '',
              'version'
            ),
            normalizeStringableLax(data.description, 'description'),
            normalizeStringableLax(data.scope, 'description'),
            data.hashes.size > 0
              ? {
                  type: 'element',
                  name: 'hashes',
                  children: this._factory.makeForHash().normalizeIter(data.hashes, options, 'hash')
                }
              : undefined,
            data.licenses.size > 0
              ? {
                  type: 'element',
                  name: 'licenses',
                  children: this._factory.makeForLicense().normalizeIter(data.licenses, options)
                }
              : undefined,
            normalizeStringableLax(data.copyright, 'copyright'),
            normalizeStringableLax(data.cpe, 'cpe'),
            normalizeStringableLax(data.purl, 'purl'),
            data.swid === null
              ? undefined
              : this._factory.makeForSWID().normalize(data.swid, options, 'swid'),
            data.externalReferences.size > 0
              ? {
                  type: 'element',
                  name: 'externalReferences',
                  children: this._factory.makeForExternalReference().normalizeIter(data.externalReferences, options, 'reference')
                }
              : undefined
          ].filter(isNotUndefined) as Types.SimpleXml.Element[] // TODO remove type hint
        }
      : undefined
  }

  normalizeIter (data: Iterable<Models.Component>, options: NormalizeOptions, elementName: string): Types.SimpleXml.Element[] {
    const components = Array.from(data)
    if (options.sortLists) {
      components.sort(Models.ComponentRepository.compareItems)
    }
    return components.map(c => this.normalize(c, options, elementName))
      .filter(isNotUndefined)
  }
}

export class LicenseNormalizer extends Base {
  normalize (data: Models.License, options: NormalizeOptions): Types.SimpleXml.Element {
    switch (true) {
      case data instanceof Models.NamedLicense:
        return this.#normalizeNamedLicense(data as Models.NamedLicense, options)
      case data instanceof Models.SpdxLicense:
        return this.#normalizeSpdxLicense(data as Models.SpdxLicense, options)
      case data instanceof Models.LicenseExpression:
        return this.#normalizeLicenseExpression(data as Models.LicenseExpression)
      default:
        throw new TypeError('Unexpected LicenseChoice')
    }
  }

  #normalizeNamedLicense (data: Models.NamedLicense, options: NormalizeOptions): Types.SimpleXml.Element {
    const url = data.url?.toString()
    return {
      type: 'element',
      name: 'license',
      children: [
        normalizeStringable(data.name, 'name'),
        data.text === null
          ? undefined
          : this._factory.makeForAttachment().normalize(data.text, options, 'text'),
        Types.XmlSchema.isAnyURI(url)
          ? normalizeStringable(url, 'url')
          : undefined
      ].filter(isNotUndefined)
    }
  }

  #normalizeSpdxLicense (data: Models.SpdxLicense, options: NormalizeOptions): Types.SimpleXml.Element {
    const url = data.url?.toString()
    return {
      type: 'element',
      name: 'license',
      children: [
        normalizeStringable(data.id, 'id'),
        data.text === null
          ? undefined
          : this._factory.makeForAttachment().normalize(data.text, options, 'text'),
        Types.XmlSchema.isAnyURI(url)
          ? normalizeStringable(url, 'url')
          : undefined
      ].filter(isNotUndefined)
    }
  }

  #normalizeLicenseExpression (data: Models.LicenseExpression): Types.SimpleXml.Element {
    return normalizeStringable(data.expression, 'expression')
  }

  normalizeIter (data: Models.LicenseRepository, options: NormalizeOptions): Types.SimpleXml.Element[] {
    const licenses = Array.from(data)
    if (options.sortLists) {
      licenses.sort(Models.LicenseRepository.compareItems)
    }
    return licenses.map(c => this.normalize(c, options))
  }
}

export class SWIDNormalizer extends Base {
  normalize (data: Models.SWID, options: NormalizeOptions, elementName: string): Types.SimpleXml.Element {
    const url = data.url?.toString()
    return {
      type: 'element',
      name: elementName,
      attributes: {
        tagId: data.tagId,
        name: data.name,
        version: data.version || undefined,
        tagVersion: data.tagVersion ?? undefined,
        patch: data.patch === null
          ? undefined
          : (data.patch ? 'true' : 'false')
      },
      children: [
        data.text === null
          ? undefined
          : this._factory.makeForAttachment().normalize(data.text, options, 'text'),
        Types.XmlSchema.isAnyURI(url)
          ? normalizeStringable(url, 'url')
          : undefined
      ].filter(isNotUndefined)
    }
  }
}

export class ExternalReferenceNormalizer extends Base {
  normalize (data: Models.ExternalReference, options: NormalizeOptions, elementName: string): Types.SimpleXml.Element | undefined {
    const url = data.url.toString()
    return this._factory.spec.supportsExternalReferenceType(data.type) &&
      Types.XmlSchema.isAnyURI(url)
      ? {
          type: 'element',
          name: elementName,
          attributes: {
            type: data.type
          },
          children: [
            normalizeStringable(url, 'url'),
            normalizeStringableLax(data.comment, 'comment')
          ].filter(isNotUndefined)
        }
      : undefined
  }

  normalizeIter (data: Iterable<Models.ExternalReference>, options: NormalizeOptions, elementName: string): Types.SimpleXml.Element[] {
    const references = Array.from(data)
    if (options.sortLists) {
      references.sort(Models.ExternalReferenceRepository.compareItems)
    }
    return references.map(r => this.normalize(r, options, elementName))
      .filter(isNotUndefined)
  }
}

export class AttachmentNormalizer extends Base {
  normalize (data: Models.Attachment, options: NormalizeOptions, elementName: string): Types.SimpleXml.Element {
    return {
      type: 'element',
      name: elementName,
      attributes: {
        'content-type': data.contentType || undefined,
        encoding: data.encoding || undefined
      },
      children: data.content
    }
  }
}

export class DependencyGraphNormalizer extends Base {
  normalize (data: Models.Bom, options: NormalizeOptions, elementName: string): Types.SimpleXml.Element | undefined {
    if (!data.metadata.component?.bomRef.value) {
      // the graph is missing the entry point -> omit the graph
      return undefined
    }

    const allRefs = new Map<Models.BomRef, Models.BomRefRepository>()
    data.components.forEach(c => allRefs.set(c.bomRef, new Models.BomRefRepository(c.dependencies)))
    allRefs.set(data.metadata.component.bomRef, data.metadata.component.dependencies)

    const normalized: Array<(Types.SimpleXml.Element & { attributes: { ref: string }})> = []
    allRefs.forEach((deps, ref) => {
      const dep = this.#normalizeDependency(ref, deps, allRefs, options)
      if (isNotUndefined(dep)) {
        normalized.push(dep)
      }
    })

    if (options.sortLists) {
      normalized.sort(({ attributes: { ref: a } }, { attributes: { ref: b } }) => a.localeCompare(b))
    }

    return {
      type: 'element',
      name: elementName,
      children: normalized
    }
  }

  #normalizeDependency (
    ref: Models.BomRef,
    deps: Models.BomRefRepository,
    allRefs: Map<Models.BomRef, Models.BomRefRepository>,
    options: NormalizeOptions
  ): undefined | (Types.SimpleXml.Element & { attributes: { ref: string }}) {
    const bomRef = ref.toString()
    if (bomRef.length === 0) {
      // no value -> cannot render
      return undefined
    }

    const dependsOn: string[] = Array.from(deps).filter(d => allRefs.has(d))
      .map(d => d.toString()).filter(d => d.length > 0)
    if (options.sortLists) {
      dependsOn.sort((a, b) => a.localeCompare(b))
    }

    return {
      type: 'element',
      name: 'dependency',
      attributes: { ref: bomRef },
      children: dependsOn.map(d => ({
        type: 'element',
        name: 'dependency',
        attributes: { ref: d }
      }))
    }
  }
}

function normalizeStringableLax (data: null | undefined | Stringable, elementName: string, allowEmpty?: boolean): undefined | (Types.SimpleXml.TextElement & { children: string }) {
  const s = data?.toString() ?? ''
  return s.length > 0 || allowEmpty
    ? normalizeStringable(s, elementName)
    : undefined
}

function normalizeStringable (data: Stringable, elementName: string): (Types.SimpleXml.TextElement & { children: string }) {
  return {
    type: 'element',
    name: elementName,
    children: data.toString()
  }
}

function normalizeStringableIter (data: Iterable<Stringable>, options: NormalizeOptions, elementName: string): Types.SimpleXml.TextElement[] {
  const r = Array.from(data, d => normalizeStringable(d, elementName))
  if (options.sortLists) {
    r.sort(({ children: a }, { children: b }) => a.localeCompare(b))
  }
  return r
}

/* eslint-enable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions */
