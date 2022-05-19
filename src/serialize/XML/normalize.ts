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

const XmlNs: ReadonlyMap<SpecVersion, string> = new Map([
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
   * @param {string} [elementName] element name.  XML defines structures; the element's name is defined on usage of a structure.
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
        xmlns: XmlNs.get(this._factory.spec.version),
        version: data.version,
        serialNumber: data.serialNumber
      },
      children: [
        data.metadata
          ? this._factory.makeForMetadata().normalize(data.metadata, options, 'metadata')
          : undefined,
        {
          type: 'element',
          name: 'components',
          children: data.components.size > 0
            ? this._factory.makeForComponent().normalizeIter(data.components, options)
            : undefined // spec < 1.4 always requires a 'components' element
        },
        this._factory.spec.supportsDependencyGraph
          ? this._factory.makeForDependencyGraph().normalize(data, options, 'dependencies')
          : undefined
      ].filter(c => c !== undefined) as Types.SimpleXml.Element[]
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
      ].filter(c => c !== undefined) as Types.SimpleXml.Element[]
    }
  }
}

export class ToolNormalizer extends Base {
  normalize (data: Models.Tool, options: NormalizeOptions, elementName: string): Types.SimpleXml.Element {
    return {
      type: 'element',
      name: elementName,
      children: [
        data.vendor
          ? {
              type: 'element',
              name: 'vendor',
              children: data.vendor
            }
          : undefined,
        data.name
          ? {
              type: 'element',
              name: 'name',
              children: data.name
            }
          : undefined,
        data.version
          ? {
              type: 'element',
              name: 'version',
              children: data.version
            }
          : undefined,
        data.hashes.size > 0
          ? {
              type: 'element',
              name: 'hashes',
              children: this._factory.makeForHash().normalizeIter(data.hashes, options, 'hash')
            }
          : undefined
      ].filter(c => c !== undefined) as Types.SimpleXml.Element[]
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
    return {
      type: 'element',
      name: elementName
      // TODO
    }
  }

  normalizeIter (data: Iterable<Models.Hash>, options: NormalizeOptions, elementName: string): Types.SimpleXml.Element[] {
    const hashes = Array.from(data)
    if (options.sortLists) {
      hashes.sort(Models.HashRepository.compareItems)
    }
    return hashes.map(h => this.normalize(h, options, elementName))
      .filter(h => undefined !== h) as Types.SimpleXml.Element[]
  }
}

export class OrganizationalContactNormalizer extends Base {
  normalize (data: Models.OrganizationalContact, options: NormalizeOptions, elementName: string): Types.SimpleXml.Element {
    return {
      type: 'element',
      name: elementName
      // TODO
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
      name: elementName
      // TODO
    }
  }
}

export class ComponentNormalizer extends Base {
  normalize (data: Models.Component, options: NormalizeOptions, elementName: string): Types.SimpleXml.Element {
    return {
      type: 'element',
      name: elementName
      // TODO
    }
  }

  normalizeIter (data: Iterable<Models.Component>, options: NormalizeOptions): Types.SimpleXml.Element[] {
    return [
      // TODO + sort
    ]
  }
}

export class LicenseNormalizer extends Base {
  normalize (data: Models.License, options: NormalizeOptions): Types.SimpleXml.Element {
    return {
      type: 'element',
      name: 'TODO'
      // TODO
    }
  }
}

export class SWIDNormalizer extends Base {
  normalize (data: Models.SWID, options: NormalizeOptions): Types.SimpleXml.Element {
    return {
      type: 'element',
      name: 'TODO'
      // TODO
    }
  }
}

export class ExternalReferenceNormalizer extends Base {
  normalize (data: Models.ExternalReference, options: NormalizeOptions): Types.SimpleXml.Element {
    return {
      type: 'element',
      name: 'TODO'
      // TODO
    }
  }
}

export class AttachmentNormalizer extends Base {
  normalize (data: Models.Attachment, options: NormalizeOptions): Types.SimpleXml.Element {
    return {
      type: 'element',
      name: 'TODO'
      // TODO
    }
  }
}

export class DependencyGraphNormalizer extends Base {
  normalize (data: Models.Bom, options: NormalizeOptions, elementName: string): Types.SimpleXml.Element {
    return {
      type: 'element',
      name: elementName
      // TODO
    }
  }
}

/* eslint-enable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions */
