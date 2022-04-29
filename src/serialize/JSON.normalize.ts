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
}

export interface Options {
  sortLists?: boolean
}

export interface Protocol {
  normalize: (data: any, options: Options) => object | undefined
}

abstract class Base implements Protocol {
  protected factory: Factory

  constructor (factory: Factory) {
    this.factory = factory
  }

  abstract normalize (data: any, options: Options): object | undefined
}

/* eslint-disable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions --
 * since empty strings need to be treated here
 **/

export class BomNormalizer extends Base {
  normalize (data: Models.Bom, options: Options): Types.Bom {
    return {
      bomFormat: 'CycloneDX',
      specVersion: this.factory.spec.version,
      version: data.version,
      serialNumber: data.serialNumber || undefined,
      metadata: this.factory.makeForMetadata().normalize(data.metadata, options),
      components: data.components.size > 0
        ? this.factory.makeForComponent().normalizeIter(data.components, options)
        : [] // spec < 1.4 requires `component` to be array
    }
  }
}

export class MetadataNormalizer extends Base {
  normalize (data: Models.Metadata, options: Options): Types.Metadata {
    const orgEntityNormalizer = this.factory.makeForOrganizationalEntity()
    return {
      timestamp: data.timestamp?.toISOString(),
      tools: data.tools.size > 0
        ? this.factory.makeForTool().normalizeIter(data.tools, options)
        : undefined,
      authors: data.authors.size > 0
        ? this.factory.makeForOrganizationalContact().normalizeIter(data.authors, options)
        : undefined,
      component: data.component === null
        ? undefined
        : this.factory.makeForComponent().normalize(data.component, options),
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
        ? this.factory.makeForHash().normalizeIter(data.hashes, options)
        : undefined
    }
  }

  normalizeIter (data: Iterable<Models.Tool>, options: Options): Types.Tool[] {
    const tools = Array.from(data)
    if (options.sortLists) { tools.sort(Models.ToolRepository.compareItems) }
    return tools.map(t => this.normalize(t, options))
  }
}

export class HashNormalizer extends Base {
  normalize ([algorithm, content]: Models.Hash, options: Options): Types.Hash | undefined {
    const spec = this.factory.spec
    return spec.supportsHashAlgorithm(algorithm) && spec.supportsHashValue(content)
      ? {
          alg: algorithm,
          content: content
        }
      : undefined
  }

  normalizeIter (data: Iterable<Models.Hash>, options: Options): Types.Hash[] {
    const hashes = Array.from(data)
    if (options.sortLists) { hashes.sort(Models.HashRepository.compareItems) }
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
    if (options.sortLists) { contacts.sort(Models.OrganizationalContactRepository.compareItems) }
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
        ? this.factory.makeForOrganizationalContact().normalizeIter(data.contact, options)
        : undefined
    }
    if (options.sortLists && r.url) { r.url.sort((a, b) => a.localeCompare(b)) }
    return r
  }
}

export class ComponentNormalizer extends Base {
  normalize (data: Models.Component, options: Options): Types.Component | undefined {
    return this.factory.spec.supportsComponentType(data.type)
      ? {
          type: data.type,
          name: data.name,
          group: data.group || undefined,
          // version fallback to string for spec < 1.4
          version: data.version || '',
          'bom-ref': data.bomRef.value || undefined,
          supplier: data.supplier === null
            ? undefined
            : this.factory.makeForOrganizationalEntity().normalize(data.supplier, options),
          author: data.author || undefined,
          publisher: data.publisher || undefined,
          description: data.description || undefined,
          scope: data.scope || undefined,
          hashes: data.hashes.size > 0
            ? this.factory.makeForHash().normalizeIter(data.hashes, options)
            : undefined,
          licenses: data.licenses.size > 0
            ? this.factory.makeForLicense().normalizeIter(data.licenses, options)
            : undefined,
          copyright: data.copyright || undefined,
          cpe: data.cpe || undefined,
          purl: data.purl?.toString(),
          swid: data.swid === null
            ? undefined
            : this.factory.makeForSWID().normalize(data.swid, options),
          externalReferences: data.externalReferences.size > 0
            ? this.factory.makeForExternalReference().normalizeIter(data.externalReferences, options)
            : undefined
        }
      : undefined
  }

  normalizeIter (data: Iterable<Models.Component>, options: Options): Types.Component[] {
    const components = Array.from(data)
    if (options.sortLists) { components.sort(Models.ComponentRepository.compareItems) }
    return components.map(c => this.normalize(c, options))
      .filter(c => undefined !== c) as Types.Component[]
  }
}

class LicenseNormalizer extends Base {
  normalize (data: Models.License, options: Options): Types.License {
    switch (true) {
      case data instanceof Models.NamedLicense:
        return this.normalizeNamedLicense(data as Models.NamedLicense, options)
      case data instanceof Models.SpdxLicense:
        return this.normalizeSpdxLicense(data as Models.SpdxLicense, options)
      case data instanceof Models.LicenseExpression:
        return this.normalizeLicenseExpression(data as Models.LicenseExpression)
      default:
        throw new RangeError('Unexpected LicenseChoice')
    }
  }

  private normalizeNamedLicense (data: Models.NamedLicense, options: Options): Types.NamedLicense {
    return {
      license: {
        name: data.name,
        text: data.text === null
          ? undefined
          : this.factory.makeForAttachment().normalize(data.text, options),
        url: data.url?.toString()
      }
    }
  }

  private normalizeSpdxLicense (data: Models.SpdxLicense, options: Options): Types.SpdxLicense {
    return {
      license: {
        id: data.id,
        text: data.text === null
          ? undefined
          : this.factory.makeForAttachment().normalize(data.text, options),
        url: data.url?.toString()
      }
    }
  }

  private normalizeLicenseExpression (data: Models.LicenseExpression): Types.LicenseExpression {
    return {
      expression: data.expression
    }
  }

  normalizeIter (data: Iterable<Models.License>, options: Options): Types.License[] {
    const licenses = Array.from(data)
    if (options.sortLists) { licenses.sort(Models.LicenseRepository.compareItems) }
    return licenses.map(c => this.normalize(c, options))
  }
}

class SWIDNormalizer extends Base {
  normalize (data: Models.SWID, options: Options): Types.SWID {
    return {
      tagId: data.tagId,
      name: data.name,
      version: data.version || undefined,
      tagVersion: data.tagVersion ?? undefined,
      patch: data.patch ?? undefined,
      text: data.text === null
        ? undefined
        : this.factory.makeForAttachment().normalize(data.text, options),
      url: data.url?.toString()
    }
  }
}

class ExternalReferenceNormalizer extends Base {
  normalize (data: Models.ExternalReference, options: Options): Types.ExternalReference | undefined {
    return this.factory.spec.supportsExternalReferenceType(data.type)
      ? {
          url: data.url.toString(),
          type: data.type,
          comment: data.comment || undefined
        }
      : undefined
  }

  normalizeIter (data: Iterable<Models.ExternalReference>, options: Options): Types.ExternalReference[] {
    const refs = Array.from(data)
    if (options.sortLists) { refs.sort(Models.ExternalReferenceRepository.compareItems) }
    return refs.map(r => this.normalize(r, options))
      .filter(r => undefined !== r) as Types.ExternalReference[]
  }
}

class AttachmentNormalizer extends Base {
  normalize (data: Models.Attachment, options: Options): Types.Attachment {
    return {
      content: data.content,
      contentType: data.contentType || undefined,
      encoding: data.encoding || undefined
    }
  }
}

/* eslint-enable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions */
