import * as Enums from '../../enums'
import { HashContent } from '../../models'
import { SpdxId } from '../../SPDX'
import { CPE, Integer, UrnUuid } from '../../types'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace JsonSchema {
  export type IriReference = string
  export function isIriReference (value: IriReference | any): value is IriReference {
    return typeof value === 'string' &&
      value.length > 0
    // TODO add proper validation according to spec
  }

  export type IdnEmail = string
  export function isIdnEmail (value: IdnEmail | any): value is IdnEmail {
    return typeof value === 'string' &&
      value.length > 0
    // TODO add proper validation according to spec
    //      see {@link https://datatracker.ietf.org/doc/html/rfc6531}
  }

  export type DateTime = string
}

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
  alg: Enums.HashAlgorithm
  content: HashContent
}

export interface Component {
  type: Enums.ComponentType
  name: string
  'mime-type'?: string
  'bom-ref'?: RefType
  supplier?: OrganizationalEntity
  author?: string
  publisher?: string
  group?: string
  version?: string
  description?: string
  scope?: Enums.ComponentScope
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
  type: Enums.ExternalReferenceType
  comment?: string
}

export interface Attachment {
  content?: string
  contentType?: string
  encoding?: Enums.AttachmentEncoding
}

export interface Dependency {
  ref: RefType
  dependsOn?: RefType[]
}
