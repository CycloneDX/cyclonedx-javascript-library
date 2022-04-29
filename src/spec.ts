import { ComponentType, ExternalReferenceType, HashAlgorithm } from './enums'
import { HashContent } from './models'

export enum Version {
  v1dot0 = '1.0',
  v1dot1 = '1.1',
  v1dot2 = '1.2',
  v1dot3 = '1.3',
  v1dot4 = '1.4',
}

export enum Format {
  XML = 'xml',
  JSON = 'json',
}

export class UnsupportedFormatError extends Error {
}

export interface Protocol {
  readonly version: Version

  supportsFormat: (f: Format | any) => boolean

  supportsComponentType: (ct: ComponentType | any) => boolean

  supportsHashAlgorithm: (ha: HashAlgorithm | any) => boolean

  supportsHashValue: (hv: HashContent | any) => boolean

  supportsExternalReferenceType: (ert: ExternalReferenceType | any) => boolean
}

class Spec implements Protocol {
  readonly #version: Version
  readonly #formats: ReadonlySet<Format>
  readonly #componentTypes: ReadonlySet<ComponentType>
  readonly #hashAlgorithms: ReadonlySet<HashAlgorithm>
  readonly #hashValuePattern: RegExp
  readonly #externalReferenceTypes: ReadonlySet<ExternalReferenceType>

  constructor (
    version: Version,
    formats: Iterable<Format>,
    componentTypes: Iterable<ComponentType>,
    hashAlgorithms: Iterable<HashAlgorithm>,
    hashValuePattern: RegExp,
    externalReferenceTypes: Iterable<ExternalReferenceType>
  ) {
    this.#version = version
    this.#formats = new Set(formats)
    this.#componentTypes = new Set(componentTypes)
    this.#hashAlgorithms = new Set(hashAlgorithms)
    this.#hashValuePattern = hashValuePattern
    this.#externalReferenceTypes = new Set(externalReferenceTypes)
  }

  get version (): Version {
    return this.#version
  }

  supportsFormat (f: Format | any): boolean {
    return this.#formats.has(f)
  }

  supportsComponentType (ct: ComponentType | any): boolean {
    return this.#componentTypes.has(ct)
  }

  supportsHashAlgorithm (ha: HashAlgorithm | any): boolean {
    return this.#hashAlgorithms.has(ha)
  }

  supportsHashValue (hv: HashContent | any): boolean {
    return typeof hv === 'string' &&
      this.#hashValuePattern.test(hv)
  }

  supportsExternalReferenceType (ert: ExternalReferenceType | any): boolean {
    return this.#externalReferenceTypes.has(ert)
  }
}

/** Specification v1.2 */
export const Spec1dot2: Protocol = Object.freeze(new Spec(
  Version.v1dot2,
  [
    Format.XML,
    Format.JSON
  ],
  [
    ComponentType.Application,
    ComponentType.Framework,
    ComponentType.Library,
    ComponentType.Container,
    ComponentType.OperatingSystem,
    ComponentType.Device,
    ComponentType.Firmware,
    ComponentType.File
  ],
  [
    HashAlgorithm.MD5,
    HashAlgorithm['SHA-1'],
    HashAlgorithm['SHA-256'],
    HashAlgorithm['SHA-384'],
    HashAlgorithm['SHA-512'],
    HashAlgorithm['SHA3-256'],
    HashAlgorithm['SHA3-384'],
    HashAlgorithm['SHA3-512'],
    HashAlgorithm['BLAKE2b-256'],
    HashAlgorithm['BLAKE2b-384'],
    HashAlgorithm['BLAKE2b-512'],
    HashAlgorithm.BLAKE3
  ],
  /^([a-fA-F0-9]{32})$|^([a-fA-F0-9]{40})$|^([a-fA-F0-9]{64})$|^([a-fA-F0-9]{96})$|^([a-fA-F0-9]{128})$/,
  [
    ExternalReferenceType.VCS,
    ExternalReferenceType.IssueTracker,
    ExternalReferenceType.Website,
    ExternalReferenceType.Advisories,
    ExternalReferenceType.BOM,
    ExternalReferenceType.MailingList,
    ExternalReferenceType.Social,
    ExternalReferenceType.Chat,
    ExternalReferenceType.Documentation,
    ExternalReferenceType.Support,
    ExternalReferenceType.Distribution,
    ExternalReferenceType.License,
    ExternalReferenceType.BuildMeta,
    ExternalReferenceType.BuildSystem,
    ExternalReferenceType.Other
  ]
))

/** Specification v1.3 */
export const Spec1dot3: Protocol = Object.freeze(new Spec(
  Version.v1dot3,
  [
    Format.XML,
    Format.JSON
  ],
  [
    ComponentType.Application,
    ComponentType.Framework,
    ComponentType.Library,
    ComponentType.Container,
    ComponentType.OperatingSystem,
    ComponentType.Device,
    ComponentType.Firmware,
    ComponentType.File
  ],
  [
    HashAlgorithm.MD5,
    HashAlgorithm['SHA-1'],
    HashAlgorithm['SHA-256'],
    HashAlgorithm['SHA-384'],
    HashAlgorithm['SHA-512'],
    HashAlgorithm['SHA3-256'],
    HashAlgorithm['SHA3-384'],
    HashAlgorithm['SHA3-512'],
    HashAlgorithm['BLAKE2b-256'],
    HashAlgorithm['BLAKE2b-384'],
    HashAlgorithm['BLAKE2b-512'],
    HashAlgorithm.BLAKE3
  ],
  /^([a-fA-F0-9]{32})$|^([a-fA-F0-9]{40})$|^([a-fA-F0-9]{64})$|%([a-fA-F0-9]{96})$|%([a-fA-F0-9]{128})$/,
  [
    ExternalReferenceType.VCS,
    ExternalReferenceType.IssueTracker,
    ExternalReferenceType.Website,
    ExternalReferenceType.Advisories,
    ExternalReferenceType.BOM,
    ExternalReferenceType.MailingList,
    ExternalReferenceType.Social,
    ExternalReferenceType.Chat,
    ExternalReferenceType.Documentation,
    ExternalReferenceType.Support,
    ExternalReferenceType.Distribution,
    ExternalReferenceType.License,
    ExternalReferenceType.BuildMeta,
    ExternalReferenceType.BuildSystem,
    ExternalReferenceType.Other
  ]
))

/** Specification v1.4 */
export const Spec1dot4: Protocol = Object.freeze(new Spec(
  Version.v1dot4,
  [
    Format.XML,
    Format.JSON
  ],
  [
    ComponentType.Application,
    ComponentType.Framework,
    ComponentType.Library,
    ComponentType.Container,
    ComponentType.OperatingSystem,
    ComponentType.Device,
    ComponentType.Firmware,
    ComponentType.File
  ],
  [
    HashAlgorithm.MD5,
    HashAlgorithm['SHA-1'],
    HashAlgorithm['SHA-256'],
    HashAlgorithm['SHA-384'],
    HashAlgorithm['SHA-512'],
    HashAlgorithm['SHA3-256'],
    HashAlgorithm['SHA3-384'],
    HashAlgorithm['SHA3-512'],
    HashAlgorithm['BLAKE2b-256'],
    HashAlgorithm['BLAKE2b-384'],
    HashAlgorithm['BLAKE2b-512'],
    HashAlgorithm.BLAKE3
  ],
  /^([a-fA-F0-9]{32})$|^([a-fA-F0-9]{40})$|^([a-fA-F0-9]{64})$|^([a-fA-F0-9]{96})$|^([a-fA-F0-9]{128})$/,
  [
    ExternalReferenceType.VCS,
    ExternalReferenceType.IssueTracker,
    ExternalReferenceType.Website,
    ExternalReferenceType.Advisories,
    ExternalReferenceType.BOM,
    ExternalReferenceType.MailingList,
    ExternalReferenceType.Social,
    ExternalReferenceType.Chat,
    ExternalReferenceType.Documentation,
    ExternalReferenceType.Support,
    ExternalReferenceType.Distribution,
    ExternalReferenceType.License,
    ExternalReferenceType.BuildMeta,
    ExternalReferenceType.BuildSystem,
    ExternalReferenceType.ReleaseNotes,
    ExternalReferenceType.Other
  ]
))

export const SpecVersionDict: { readonly [key in Version]?: Protocol } = Object.freeze(Object.fromEntries([
  [Version.v1dot2, Spec1dot2],
  [Version.v1dot3, Spec1dot3],
  [Version.v1dot4, Spec1dot4]
]))
