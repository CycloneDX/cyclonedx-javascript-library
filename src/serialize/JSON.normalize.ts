import { Protocol as SpecProtocol } from '../spec'
import * as Models from '../models'
import * as Types from './JSON.types'

export class Factory {
  readonly spec: SpecProtocol

  constructor (spec: SpecProtocol) {
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

export interface Options {
  sortLists?: boolean
}

abstract class Base {
  protected readonly _factory: Factory

  constructor (factory: Factory) {
    this._factory = factory
  }

  abstract normalize (data: object, options: Options): object | undefined
}

/* eslint-disable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions --
 * since empty strings need to be treated as undefined/null
 */

export class BomNormalizer extends Base {
  normalize (data: Models.Bom, options: Options): Types.Bom {
    return {
      // Do not set $schema here. it is part of the final serializer, not the normalizer
      bomFormat: 'CycloneDX',
      specVersion: this._factory.spec.version,
      version: data.version,
      serialNumber: data.serialNumber ?? undefined,
      metadata: this._factory.makeForMetadata().normalize(data.metadata, options),
      components: data.components.size > 0
        ? this._factory.makeForComponent().normalizeIter(data.components, options)
        // spec < 1.4 requires `component` to be array
        : [],
      dependencies: this._factory.spec.supportsDependencyGraph
        ? this._factory.makeForDependencyGraph().normalize(data, options)
        : undefined
    }
  }
}

export class MetadataNormalizer extends Base {
  normalize (data: Models.Metadata, options: Options): Types.Metadata {
    const orgEntityNormalizer = this._factory.makeForOrganizationalEntity()
    return {
      timestamp: data.timestamp?.toISOString(),
      tools: data.tools.size > 0
        ? this._factory.makeForTool().normalizeIter(data.tools, options)
        : undefined,
      authors: data.authors.size > 0
        ? this._factory.makeForOrganizationalContact().normalizeIter(data.authors, options)
        : undefined,
      component: data.component === null
        ? undefined
        : this._factory.makeForComponent().normalize(data.component, options),
      manufacture: data.manufacture === null
        ? undefined
        : orgEntityNormalizer.normalize(data.manufacture, options),
      supplier: data.supplier === null
        ? undefined
        : orgEntityNormalizer.normalize(data.supplier, options)
    }
  }
}

export class ToolNormalizer extends Base {
  normalize (data: Models.Tool, options: Options): Types.Tool {
    return {
      vendor: data.vendor || undefined,
      name: data.name || undefined,
      version: data.version || undefined,
      hashes: data.hashes.size > 0
        ? this._factory.makeForHash().normalizeIter(data.hashes, options)
        : undefined
    }
  }

  normalizeIter (data: Iterable<Models.Tool>, options: Options): Types.Tool[] {
    const tools = Array.from(data)
    if (options.sortLists) {
      tools.sort(Models.ToolRepository.compareItems)
    }
    return tools.map(t => this.normalize(t, options))
  }
}

export class HashNormalizer extends Base {
  normalize ([algorithm, content]: Models.Hash, options: Options): Types.Hash | undefined {
    const spec = this._factory.spec
    return spec.supportsHashAlgorithm(algorithm) && spec.supportsHashValue(content)
      ? {
          alg: algorithm,
          content: content
        }
      : undefined
  }

  normalizeIter (data: Iterable<Models.Hash>, options: Options): Types.Hash[] {
    const hashes = Array.from(data)
    if (options.sortLists) {
      hashes.sort(Models.HashRepository.compareItems)
    }
    return hashes.map(h => this.normalize(h, options))
      .filter(h => undefined !== h) as Types.Hash[]
  }
}

export class OrganizationalContactNormalizer extends Base {
  normalize (data: Models.OrganizationalContact, options: Options): Types.OrganizationalContact {
    return {
      name: data.name || undefined,
      // email must conform to https://datatracker.ietf.org/doc/html/rfc6531
      email: data.email || undefined,
      phone: data.phone || undefined
    }
  }

  normalizeIter (data: Iterable<Models.OrganizationalContact>, options: Options): Types.OrganizationalContact[] {
    const contacts = Array.from(data)
    if (options.sortLists) {
      contacts.sort(Models.OrganizationalContactRepository.compareItems)
    }
    return contacts.map(c => this.normalize(c, options))
  }
}

export class OrganizationalEntityNormalizer extends Base {
  normalize (data: Models.OrganizationalEntity, options: Options): Types.OrganizationalEntity {
    const r = {
      name: data.name || undefined,
      url: data.url.size > 0
        // must comply to https://datatracker.ietf.org/doc/html/rfc3987
        ? Array.from(data.url, u => u.toString())
        : undefined,
      contact: data.contact.size > 0
        ? this._factory.makeForOrganizationalContact().normalizeIter(data.contact, options)
        : undefined
    }
    if (options.sortLists && r.url) {
      r.url.sort((a, b) => a.localeCompare(b))
    }
    return r
  }
}

export class ComponentNormalizer extends Base {
  normalize (data: Models.Component, options: Options): Types.Component | undefined {
    return this._factory.spec.supportsComponentType(data.type)
      ? {
          type: data.type,
          name: data.name,
          group: data.group || undefined,
          // version fallback to string for spec < 1.4
          version: data.version || '',
          'bom-ref': data.bomRef.value || undefined,
          supplier: data.supplier === null
            ? undefined
            : this._factory.makeForOrganizationalEntity().normalize(data.supplier, options),
          author: data.author || undefined,
          publisher: data.publisher || undefined,
          description: data.description || undefined,
          scope: data.scope ?? undefined,
          hashes: data.hashes.size > 0
            ? this._factory.makeForHash().normalizeIter(data.hashes, options)
            : undefined,
          licenses: data.licenses.size > 0
            ? this._factory.makeForLicense().normalizeIter(data.licenses, options)
            : undefined,
          copyright: data.copyright || undefined,
          cpe: data.cpe || undefined,
          purl: data.purl?.toString(),
          swid: data.swid === null
            ? undefined
            : this._factory.makeForSWID().normalize(data.swid, options),
          externalReferences: data.externalReferences.size > 0
            ? this._factory.makeForExternalReference().normalizeIter(data.externalReferences, options)
            : undefined
        }
      : undefined
  }

  normalizeIter (data: Iterable<Models.Component>, options: Options): Types.Component[] {
    const components = Array.from(data)
    if (options.sortLists) {
      components.sort(Models.ComponentRepository.compareItems)
    }
    return components.map(c => this.normalize(c, options))
      .filter(c => undefined !== c) as Types.Component[]
  }
}

export class LicenseNormalizer extends Base {
  normalize (data: Models.License, options: Options): Types.License {
    switch (true) {
      case data instanceof Models.NamedLicense:
        return this.#normalizeNamedLicense(data as Models.NamedLicense, options)
      case data instanceof Models.SpdxLicense:
        return this.#normalizeSpdxLicense(data as Models.SpdxLicense, options)
      case data instanceof Models.LicenseExpression:
        return this.#normalizeLicenseExpression(data as Models.LicenseExpression)
      default:
        throw new RangeError('Unexpected LicenseChoice')
    }
  }

  #normalizeNamedLicense (data: Models.NamedLicense, options: Options): Types.NamedLicense {
    return {
      license: {
        name: data.name,
        text: data.text === null
          ? undefined
          : this._factory.makeForAttachment().normalize(data.text, options),
        url: data.url?.toString()
      }
    }
  }

  #normalizeSpdxLicense (data: Models.SpdxLicense, options: Options): Types.SpdxLicense {
    return {
      license: {
        id: data.id,
        text: data.text === null
          ? undefined
          : this._factory.makeForAttachment().normalize(data.text, options),
        url: data.url?.toString()
      }
    }
  }

  #normalizeLicenseExpression (data: Models.LicenseExpression): Types.LicenseExpression {
    return {
      expression: data.expression
    }
  }

  normalizeIter (data: Iterable<Models.License>, options: Options): Types.License[] {
    const licenses = Array.from(data)
    if (options.sortLists) {
      licenses.sort(Models.LicenseRepository.compareItems)
    }
    return licenses.map(c => this.normalize(c, options))
  }
}

export class SWIDNormalizer extends Base {
  normalize (data: Models.SWID, options: Options): Types.SWID {
    return {
      tagId: data.tagId,
      name: data.name,
      version: data.version || undefined,
      tagVersion: data.tagVersion ?? undefined,
      patch: data.patch ?? undefined,
      text: data.text === null
        ? undefined
        : this._factory.makeForAttachment().normalize(data.text, options),
      url: data.url?.toString()
    }
  }
}

export class ExternalReferenceNormalizer extends Base {
  normalize (data: Models.ExternalReference, options: Options): Types.ExternalReference | undefined {
    return this._factory.spec.supportsExternalReferenceType(data.type)
      ? {
          url: data.url.toString(),
          type: data.type,
          comment: data.comment || undefined
        }
      : undefined
  }

  normalizeIter (data: Iterable<Models.ExternalReference>, options: Options): Types.ExternalReference[] {
    const refs = Array.from(data)
    if (options.sortLists) {
      refs.sort(Models.ExternalReferenceRepository.compareItems)
    }
    return refs.map(r => this.normalize(r, options))
      .filter(r => undefined !== r) as Types.ExternalReference[]
  }
}

export class AttachmentNormalizer extends Base {
  normalize (data: Models.Attachment, options: Options): Types.Attachment {
    return {
      content: data.content,
      contentType: data.contentType || undefined,
      encoding: data.encoding ?? undefined
    }
  }
}

export class DependencyGraphNormalizer extends Base {
  normalize (data: Models.Bom, options: Options): Types.Dependency[] | undefined {
    if (!data.metadata.component) {
      // the graph is missing the entry point -> omit the graph
      return undefined
    }

    const allDeps = new Map<Models.BomRef, Models.BomRefRepository>()
    data.components.forEach(c => allDeps.set(c.bomRef, new Models.BomRefRepository(c.dependencies)))
    allDeps.set(data.metadata.component.bomRef, data.metadata.component.dependencies)

    const normalized: Types.Dependency[] = []
    allDeps.forEach((deps, ref) => {
      const dep = this.#normalizeDependency(ref, deps, allDeps)
      if (dep) { normalized.push(dep) }
    })

    if (options.sortLists) {
      normalized.sort((a, b) => a.ref.localeCompare(b.ref))
      normalized.forEach(d => d.dependsOn?.sort((a, b) => a.localeCompare(b)))
    }

    return normalized
  }

  #normalizeDependency (
    ref: Models.BomRef,
    deps: Models.BomRefRepository,
    allDeps: Map<Models.BomRef, Models.BomRefRepository>
  ): Types.Dependency | undefined {
    if (!ref.value) {
      // no value -> cannot render
      return undefined
    }

    const dependsOn = Array.from(deps).filter(d => allDeps.has(d))
      .map(d => d.value).filter(v => !!v) as string[]

    return {
      ref: ref.value,
      dependsOn: dependsOn.length > 0
        ? dependsOn
        : undefined
    }
  }
}

/* eslint-enable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions */
