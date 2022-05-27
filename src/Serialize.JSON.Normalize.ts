import { isNotUndefined, Stringable } from './helpers/types'
import { Protocol as Spec, Version as SpecVersion } from './Spec'
import { NormalizerOptions } from './Serialize.Types'
import { Bom } from './Models.Bom'
import { Metadata } from './Models.Metadata'
import { JsonSchema, Normalized } from './Serialize.JSON.Types'
import { Tool, ToolRepository } from './Models.Tool'
import { Hash, HashRepository } from './Models.Hash'
import { OrganizationalContact, OrganizationalContactRepository } from './Models.OrganizationalContact'
import { OrganizationalEntity } from './Models.OrganizationalEntity'
import { Component, ComponentRepository } from './Models.Component'
import { License, LicenseExpression, LicenseRepository, NamedLicense, SpdxLicense } from './Models.License'
import { SWID } from './Models.SWID'
import { ExternalReference, ExternalReferenceRepository } from './Models.ExternalReference'
import { Attachment } from './Models.Attachment'
import { BomRef, BomRefRepository } from './Models.BomRef'

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

const schemaUrl: ReadonlyMap<SpecVersion, string> = new Map([
  [SpecVersion.v1dot2, 'http://cyclonedx.org/schema/bom-1.2b.schema.json'],
  [SpecVersion.v1dot3, 'http://cyclonedx.org/schema/bom-1.3a.schema.json'],
  [SpecVersion.v1dot4, 'http://cyclonedx.org/schema/bom-1.4.schema.json']
])

interface Normalizer {
  normalize: (data: object, options: NormalizerOptions) => object | undefined

  normalizeIter?: (data: Iterable<object>, options: NormalizerOptions) => object[]
}

abstract class Base implements Normalizer {
  protected readonly _factory: Factory

  constructor (factory: Factory) {
    this._factory = factory
  }

  abstract normalize (data: object, options: NormalizerOptions): object | undefined
}

/* eslint-disable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions --
 * since empty strings need to be treated as undefined/null
 */

export class BomNormalizer extends Base {
  normalize (data: Bom, options: NormalizerOptions): Normalized.Bom {
    return {
      $schema: schemaUrl.get(this._factory.spec.version),
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
  normalize (data: Metadata, options: NormalizerOptions): Normalized.Metadata {
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
  normalize (data: Tool, options: NormalizerOptions): Normalized.Tool {
    return {
      vendor: data.vendor || undefined,
      name: data.name || undefined,
      version: data.version || undefined,
      hashes: data.hashes.size > 0
        ? this._factory.makeForHash().normalizeIter(data.hashes, options)
        : undefined
    }
  }

  normalizeIter (data: Iterable<Tool>, options: NormalizerOptions): Normalized.Tool[] {
    const tools = Array.from(data)
    if (options.sortLists ?? false) {
      tools.sort(ToolRepository.compareItems)
    }
    return tools.map(t => this.normalize(t, options))
  }
}

export class HashNormalizer extends Base {
  normalize ([algorithm, content]: Hash, options: NormalizerOptions): Normalized.Hash | undefined {
    const spec = this._factory.spec
    return spec.supportsHashAlgorithm(algorithm) && spec.supportsHashValue(content)
      ? {
          alg: algorithm,
          content: content
        }
      : undefined
  }

  normalizeIter (data: Iterable<Hash>, options: NormalizerOptions): Normalized.Hash[] {
    const hashes = Array.from(data)
    if (options.sortLists ?? false) {
      hashes.sort(HashRepository.compareItems)
    }
    return hashes.map(h => this.normalize(h, options))
      .filter(isNotUndefined)
  }
}

export class OrganizationalContactNormalizer extends Base {
  normalize (data: OrganizationalContact, options: NormalizerOptions): Normalized.OrganizationalContact {
    return {
      name: data.name || undefined,
      email: JsonSchema.isIdnEmail(data.email)
        ? data.email
        : undefined,
      phone: data.phone || undefined
    }
  }

  normalizeIter (data: Iterable<OrganizationalContact>, options: NormalizerOptions): Normalized.OrganizationalContact[] {
    const contacts = Array.from(data)
    if (options.sortLists ?? false) {
      contacts.sort(OrganizationalContactRepository.compareItems)
    }
    return contacts.map(c => this.normalize(c, options))
  }
}

export class OrganizationalEntityNormalizer extends Base {
  normalize (data: OrganizationalEntity, options: NormalizerOptions): Normalized.OrganizationalEntity {
    const urls = normalizeStringableIter(data.url, options)
      .filter(JsonSchema.isIriReference)
    return {
      name: data.name || undefined,
      /** must comply to {@link https://datatracker.ietf.org/doc/html/rfc3987} */
      url: urls.length > 0
        ? urls
        : undefined,
      contact: data.contact.size > 0
        ? this._factory.makeForOrganizationalContact().normalizeIter(data.contact, options)
        : undefined
    }
  }
}

export class ComponentNormalizer extends Base {
  normalize (data: Component, options: NormalizerOptions): Normalized.Component | undefined {
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

  normalizeIter (data: Iterable<Component>, options: NormalizerOptions): Normalized.Component[] {
    const components = Array.from(data)
    if (options.sortLists ?? false) {
      components.sort(ComponentRepository.compareItems)
    }
    return components.map(c => this.normalize(c, options))
      .filter(isNotUndefined)
  }
}

export class LicenseNormalizer extends Base {
  normalize (data: License, options: NormalizerOptions): Normalized.License {
    switch (true) {
      case data instanceof NamedLicense:
        return this.#normalizeNamedLicense(data as NamedLicense, options)
      case data instanceof SpdxLicense:
        return this.#normalizeSpdxLicense(data as SpdxLicense, options)
      case data instanceof LicenseExpression:
        return this.#normalizeLicenseExpression(data as LicenseExpression)
      default:
        throw new TypeError('Unexpected LicenseChoice')
    }
  }

  #normalizeNamedLicense (data: NamedLicense, options: NormalizerOptions): Normalized.NamedLicense {
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

  #normalizeSpdxLicense (data: SpdxLicense, options: NormalizerOptions): Normalized.SpdxLicense {
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

  #normalizeLicenseExpression (data: LicenseExpression): Normalized.LicenseExpression {
    return {
      expression: data.expression
    }
  }

  normalizeIter (data: Iterable<License>, options: NormalizerOptions): Normalized.License[] {
    const licenses = Array.from(data)
    if (options.sortLists ?? false) {
      licenses.sort(LicenseRepository.compareItems)
    }
    return licenses.map(c => this.normalize(c, options))
  }
}

export class SWIDNormalizer extends Base {
  normalize (data: SWID, options: NormalizerOptions): Normalized.SWID {
    const url = data.url?.toString()
    return {
      tagId: data.tagId,
      name: data.name,
      version: data.version || undefined,
      tagVersion: data.tagVersion ?? undefined,
      patch: data.patch ?? undefined,
      text: data.text === null
        ? undefined
        : this._factory.makeForAttachment().normalize(data.text, options),
      url: JsonSchema.isIriReference(url)
        ? url
        : undefined
    }
  }
}

export class ExternalReferenceNormalizer extends Base {
  normalize (data: ExternalReference, options: NormalizerOptions): Normalized.ExternalReference | undefined {
    return this._factory.spec.supportsExternalReferenceType(data.type)
      ? {
          url: data.url.toString(),
          type: data.type,
          comment: data.comment || undefined
        }
      : undefined
  }

  normalizeIter (data: Iterable<ExternalReference>, options: NormalizerOptions): Normalized.ExternalReference[] {
    const refs = Array.from(data)
    if (options.sortLists ?? false) {
      refs.sort(ExternalReferenceRepository.compareItems)
    }
    return refs.map(r => this.normalize(r, options))
      .filter(isNotUndefined)
  }
}

export class AttachmentNormalizer extends Base {
  normalize (data: Attachment, options: NormalizerOptions): Normalized.Attachment {
    return {
      content: data.content,
      contentType: data.contentType || undefined,
      encoding: data.encoding ?? undefined
    }
  }
}

export class DependencyGraphNormalizer extends Base {
  normalize (data: Bom, options: NormalizerOptions): Normalized.Dependency[] | undefined {
    if (!data.metadata.component?.bomRef.value) {
      // the graph is missing the entry point -> omit the graph
      return undefined
    }

    const allRefs = new Map<BomRef, BomRefRepository>()
    for (const c of data.components) {
      allRefs.set(c.bomRef, new BomRefRepository(c.dependencies))
    }
    allRefs.set(data.metadata.component.bomRef, data.metadata.component.dependencies)

    const normalized: Normalized.Dependency[] = []
    for (const [ref, deps] of allRefs) {
      const dep = this.#normalizeDependency(ref, deps, allRefs, options)
      if (isNotUndefined(dep)) {
        normalized.push(dep)
      }
    }

    if (options.sortLists ?? false) {
      normalized.sort(({ ref: a }, { ref: b }) => a.localeCompare(b))
    }

    return normalized
  }

  #normalizeDependency (
    ref: BomRef,
    deps: BomRefRepository,
    allRefs: Map<BomRef, BomRefRepository>,
    options: NormalizerOptions
  ): Normalized.Dependency | undefined {
    const bomRef = ref.toString()
    if (bomRef.length === 0) {
      // no value -> cannot render
      return undefined
    }

    const dependsOn: string[] = normalizeStringableIter(
      Array.from(deps).filter(d => allRefs.has(d)),
      options
    ).filter(d => d.length > 0)

    return {
      ref: bomRef,
      dependsOn: dependsOn.length > 0
        ? dependsOn
        : undefined
    }
  }
}

/* eslint-enable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions */

function normalizeStringableIter (data: Iterable<Stringable>, options: NormalizerOptions): string[] {
  const r: string[] = Array.from(data, d => d.toString())
  if (options.sortLists ?? false) {
    r.sort((a, b) => a.localeCompare(b))
  }
  return r
}
