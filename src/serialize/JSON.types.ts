import * as Enums from '../enums'
import { SpdxId } from '../SPDX'
import { CPE, PositiveInteger, UrnUuid } from '../types'
import { BomRef, HashContent } from '../models'

type IriReference = string
type IdnEmail = string
type DateTime = string

type RefType = string

export interface Bom {
  '$schema'?: string
  bomFormat: 'CycloneDX'
  specVersion: string
  version: PositiveInteger
  serialNumber?: UrnUuid
  metadata?: Metadata
  components?: Component[]
  externalReferences?: ExternalReference[]
  dependencies?: Depndency[]
}

export interface Metadata {
  timestamp?: DateTime
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
  email?: IdnEmail
  phone?: string
}

export interface OrganizationalEntity {
  name?: string
  url?: IriReference[]
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
  tagVersion?: number
  patch?: boolean
  text?: Attachment
  url?: IriReference
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

export interface Depndency {
  ref: BomRef
  dependsOn?: BomRef[]
}
