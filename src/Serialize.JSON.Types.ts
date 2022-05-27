import { HashAlgorithm } from './Enums.HashAlogorithm'
import { HashContent } from './Models.Hash'
import { ComponentType } from './Enums.ComponentType'
import { CPE } from './Types.CPE'
import { ComponentScope } from './Enums.ComponentScope'
import { SpdxId } from './SPDX'
import { Integer } from './Types.Integer'
import { ExternalReferenceType } from './Enums.ExternalReferenceType'
import { AttachmentEncoding } from './Enums.AttachmentEncoding'
import { UrnUuid } from './Types.URN'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace JsonSchema {
  export type IriReference = string
  /**
   * Test whether format is JSON::iri-reference - best-effort.
   *
   * @see {@link https://datatracker.ietf.org/doc/html/rfc3987}
   */
  export function isIriReference (value: IriReference | any): value is IriReference {
    return typeof value === 'string' &&
      value.length > 0
    // TODO add more validation according to spec
  }

  export type IdnEmail = string
  /**
   * Test whether format is JSON::idn-email - best-effort.
   *
   * @see {@link https://datatracker.ietf.org/doc/html/rfc6531}
   */
  export function isIdnEmail (value: IdnEmail | any): value is IdnEmail {
    return typeof value === 'string' &&
      value.length > 0
    // TODO add more validation according to spec
  }

  export type DateTime = string
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Normalized {
  export type RefType = string

  export interface Bom {
    $schema?: string
    bomFormat: 'CycloneDX'
    specVersion: string
    version: Integer
    serialNumber?: UrnUuid
    metadata?: Metadata
    components?: Component[]
    externalReferences?: ExternalReference[]
    dependencies?: Dependency[]
  }

  export interface Metadata {
    timestamp?: JsonSchema.DateTime
    tools?: Tool[]
    authors?: OrganizationalContact[]
    component?: Component
    manufacture?: OrganizationalEntity
    supplier?: OrganizationalEntity
    licenses?: License[]
  }

  export interface Tool {
    vendor?: string
    name?: string
    version?: string
    hashes?: Hash[]
    externalReferences?: ExternalReference[]
  }

  export interface OrganizationalContact {
    name?: string
    email?: JsonSchema.IdnEmail
    phone?: string
  }

  export interface OrganizationalEntity {
    name?: string
    url?: JsonSchema.IriReference[]
    contact?: OrganizationalContact[]
  }

  export interface Hash {
    alg: HashAlgorithm
    content: HashContent
  }

  export interface Component {
    type: ComponentType
    name: string
    'mime-type'?: string
    'bom-ref'?: RefType
    supplier?: OrganizationalEntity
    author?: string
    publisher?: string
    group?: string
    version?: string
    description?: string
    scope?: ComponentScope
    hashes?: Hash[]
    licenses?: License[]
    copyright?: string
    cpe?: CPE
    purl?: string
    swid?: SWID
    modified?: boolean
    externalReferences?: ExternalReference[]
    components?: Component[]
  }

  export interface NamedLicense {
    license: {
      name: string
      text?: Attachment
      url?: string
    }
  }

  export interface SpdxLicense {
    license: {
      /** @see {@link http://cyclonedx.org/schema/spdx} */
      id: SpdxId
      text?: Attachment
      url?: string
    }
  }

  export interface LicenseExpression {
    expression: string
  }

  export type License = NamedLicense | SpdxLicense | LicenseExpression

  export interface SWID {
    tagId: string
    name: string
    version?: string
    tagVersion?: Integer
    patch?: boolean
    text?: Attachment
    url?: JsonSchema.IriReference
  }

  export interface ExternalReference {
    url: string
    type: ExternalReferenceType
    comment?: string
  }

  export interface Attachment {
    content?: string
    contentType?: string
    encoding?: AttachmentEncoding
  }

  export interface Dependency {
    ref: RefType
    dependsOn?: RefType[]
  }
}
