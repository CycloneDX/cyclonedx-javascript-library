import * as Models from '../models'
import { Protocol as SpecProtocol } from '../spec'

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

export interface Protocol {
  normalize: (data: any) => object | undefined
}

abstract class Base implements Protocol {
  protected factory: Factory

  constructor (factory: Factory) {
    this.factory = factory
  }

  abstract normalize (data: any): object | undefined
}

/* eslint-disable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions --
 * since empty strings need to be treated here
 **/

export class BomNormalizer extends Base {
  normalize (data: Models.Bom): object {
    return {
      bomFormat: 'CycloneDX',
      specVersion: this.factory.spec.version,
      version: data.version,
      serialNumber: data.serialNumber || undefined,
      metadata: this.factory.makeForMetadata().normalize(data.metadata),
      components: data.components.size > 0
        ? this.factory.makeForComponent().normalizeIter(data.components)
        : [] // spec < 1.4 requires `component` to be array
    }
  }
}

export class MetadataNormalizer extends Base {
  normalize (data: Models.Metadata): object {
    const toolNormalizer = this.factory.makeForTool()
    const orgContactNormalizer = this.factory.makeForOrganizationalContact()
    const orgEntityNormalizer = this.factory.makeForOrganizationalEntity()
    return {
      timestamp: data.timestamp?.toISOString(),
      tools: data.tools.size > 0
        ? Array.from(data.tools, t => toolNormalizer.normalize(t))
        : undefined,
      authors: data.authors.size > 0
        ? Array.from(data.authors, a => orgContactNormalizer.normalize(a))
        : undefined,
      component: data.component === null
        ? undefined
        : this.factory.makeForComponent().normalize(data.component),
      manufacture: data.manufacture === null
        ? undefined
        : orgEntityNormalizer.normalize(data.manufacture),
      supplier: data.supplier === null
        ? undefined
        : orgEntityNormalizer.normalize(data.supplier)
    }
  }
}

export class ToolNormalizer extends Base {
  normalize (data: Models.Tool): object {
    const hashNormalizer = this.factory.makeForHash()
    return {
      vendor: data.vendor || undefined,
      name: data.name || undefined,
      version: data.version || undefined,
      hashes: data.hashes.size > 0
        ? hashNormalizer.normalizeIter(data.hashes)
        : undefined
    }
  }
}

export class HashNormalizer extends Base {
  normalize ([algorithm, content]: Models.Hash): object | undefined {
    const spec = this.factory.spec
    return spec.supportsHashAlgorithm(algorithm) && spec.supportsHashValue(content)
      ? {
          alg: algorithm,
          content: content
        }
      : undefined
  }

  normalizeIter (data: Iterable<Models.Hash>): object[] {
    return Array.from(data, h => this.normalize(h))
      .filter(h => undefined !== h) as object[]
  }
}

export class OrganizationalContactNormalizer extends Base {
  normalize (data: Models.OrganizationalContact): object {
    return {
      name: data.name || undefined,
      // email must conform to https://datatracker.ietf.org/doc/html/rfc6531
      email: data.email || undefined,
      phone: data.phone || undefined
    }
  }
}

export class OrganizationalEntityNormalizer extends Base {
  normalize (data: Models.OrganizationalEntity): object {
    const contactNormalizer = this.factory.makeForOrganizationalContact()
    return {
      name: data.name || undefined,
      url: data.url.size > 0
        // must comply to https://datatracker.ietf.org/doc/html/rfc3987
        ? Array.from(data.url, u => u.toString())
        : undefined,
      contact: data.contact.size > 0
        ? Array.from(data.contact, c => contactNormalizer.normalize(c))
        : undefined
    }
  }
}

export class ComponentNormalizer extends Base {
  normalize (data: Models.Component): object | undefined {
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
            : this.factory.makeForOrganizationalEntity().normalize(data.supplier),
          author: data.author || undefined,
          publisher: data.publisher || undefined,
          description: data.description || undefined,
          scope: data.scope || undefined,
          hashes: data.hashes.size > 0
            ? this.factory.makeForHash().normalizeIter(data.hashes)
            : undefined,
          licenses: data.licenses.size > 0
            ? this.factory.makeForLicense().normalizeIter(data.licenses)
            : undefined,
          copyright: data.copyright || undefined,
          cpe: data.cpe || undefined,
          purl: data.purl?.toString(),
          swid: (data.swid === null)
            ? undefined
            : this.factory.makeForSWID().normalize(data.swid),
          externalReferences: data.externalReferences.size > 0
            ? this.factory.makeForExternalReference().normalizeIter(data.externalReferences)
            : undefined
        }
      : undefined
  }

  normalizeIter (data: Iterable<Models.Component>): object[] {
    return Array.from(data, c => this.normalize(c))
      .filter(c => undefined !== c) as object[]
  }
}

class LicenseNormalizer extends Base {
  normalize (data: Models.License): object | undefined {
    switch (true) {
      case data instanceof Models.NamedLicense:
        return this.normalizeNamedLicense(data as Models.NamedLicense)
      case data instanceof Models.SpdxLicense:
        return this.normalizeSpdxLicense(data as Models.SpdxLicense)
      case data instanceof Models.LicenseExpression:
        return this.normalizeLicenseExpression(data as Models.LicenseExpression)
      default:
        throw new RangeError('Unexpected LicenseChoice')
    }
  }

  private readonly normalizeNamedLicense = (data: Models.NamedLicense): object => ({
    license: {
      name: data.name,
      text: data.text === null
        ? undefined
        : this.factory.makeForAttachment().normalize(data.text),
      url: data.url?.toString()
    }
  })

  private readonly normalizeSpdxLicense = (data: Models.SpdxLicense): object => ({
    license: {
      id: data.id,
      text: data.text === null
        ? undefined
        : this.factory.makeForAttachment().normalize(data.text),
      url: data.url?.toString()
    }
  })

  private readonly normalizeLicenseExpression = (data: Models.LicenseExpression): object => ({
    expression: data.expression
  })

  normalizeIter (data: Iterable<Models.License>): object[] {
    return Array.from(data, c => this.normalize(c))
      .filter(c => undefined !== c) as object[]
  }
}

class SWIDNormalizer extends Base {
  normalize (data: Models.SWID): object {
    return {
      tagId: data.tagId,
      name: data.name,
      version: data.version || undefined,
      tagVersion: data.tagVersion ?? undefined,
      patch: data.patch ?? undefined,
      text: data.text === null
        ? undefined
        : this.factory.makeForAttachment().normalize(data.text),
      url: data.url?.toString()
    }
  }
}

class ExternalReferenceNormalizer extends Base {
  normalize (data: Models.ExternalReference): object | undefined {
    return this.factory.spec.supportsExternalReferenceType(data.type)
      ? {
          url: data.url.toString(),
          type: data.type,
          comment: data.comment || undefined
        }
      : undefined
  }

  normalizeIter (data: Iterable<Models.ExternalReference>): object[] {
    return Array.from(data, r => this.normalize(r))
      .filter(r => undefined !== r) as object[]
  }
}

class AttachmentNormalizer extends Base {
  normalize (data: Models.Attachment): object {
    return {
      content: data.content,
      contentType: data.contentType || undefined,
      encoding: data.encoding || undefined
    }
  }
}

/* eslint-enable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions */
