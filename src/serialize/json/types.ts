/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

import type * as Enums from '../../enums'
import type { HashContent } from '../../models'
import type { SpdxId } from '../../spdx'
import type { CPE, CWE, Integer } from '../../types'

/* eslint-disable-next-line @typescript-eslint/no-namespace -- needed */
export namespace JsonSchema {

  /**
   * @see {@link isIriReference}
   */
  export type IriReference = string
  /**
   * Test whether format is JSON::iri-reference - best-effort.
   *
   * @see {@link https://datatracker.ietf.org/doc/html/rfc3987 | RFC 3987}
   *
   * @TODO add more validation according to spec
   */
  export function isIriReference (value: IriReference | any): value is IriReference {
    // There is just no working implementation for format "iri-reference": see https://github.com/luzlab/ajv-formats-draft2019/issues/22
    return typeof value === 'string' &&
      value.length > 0
  }

  /**
   * @see {@link isIdnEmail}
   */
  export type IdnEmail = string
  /**
   * Test whether format is JSON::idn-email - best-effort.
   *
   * @see {@link https://datatracker.ietf.org/doc/html/rfc6531 | RFC 6531}
   *
   * @TODO add more validation according to spec
   */
  export function isIdnEmail (value: IdnEmail | any): value is IdnEmail {
    return typeof value === 'string' &&
      value.length > 0
  }

  export type DateTime = string

}

/* eslint-disable-next-line @typescript-eslint/no-namespace -- needed */
export namespace Normalized {

  export type RefType = string
  export type RefLinkType = RefType

  export type BomLinkDocumentType = string
  export type BomLinkElementType = string
  /* eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents -- as of spec */
  export type BomLink = BomLinkDocumentType | BomLinkElementType

  export interface Bom {
    $schema?: string
    bomFormat: 'CycloneDX'
    specVersion: string
    version: Integer
    serialNumber?: string
    metadata?: Metadata
    components?: Component[]
    services?: Service[]
    externalReferences?: ExternalReference[]
    dependencies?: Dependency[]
    vulnerabilities?: Vulnerability[]
  }

  export interface Metadata {
    timestamp?: JsonSchema.DateTime
    lifecycles?: Lifecycle[]
    tools?: ToolsType
    authors?: OrganizationalContact[]
    component?: Component
    manufacture?: OrganizationalEntity
    supplier?: OrganizationalEntity
    licenses?: License[]
    properties?: Property[]
  }

  export interface LifecyclePhase {
    phase: Enums.LifecyclePhase
  }

  export interface NamedLifecycle {
    name: string
    description?: string
  }

  export type Lifecycle = LifecyclePhase | NamedLifecycle

  export interface Tool {
    vendor?: string
    name?: string
    version?: string
    hashes?: Hash[]
    externalReferences?: ExternalReference[]
  }

  /** since CDX 1.5 */
  export interface Tools {
    components?: Component[]
    services?: Service[]
  }

  export type ToolsType = Tools | Tool[]

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
    evidence?: ComponentEvidence
    properties?: Property[]
  }

  export interface Service {
    'bom-ref'?: RefType
    provider?: OrganizationalEntity
    group?: string
    name: string
    version?: string
    description?: string
    licenses?: License[]
    externalReferences?: ExternalReference[]
    services?: Service[]
    properties?: Property[]
  }

  export interface ComponentEvidence {
    licenses?: License[]
    copyright?: Copyright[]
  }

  export interface Copyright {
    text: string
  }

  export interface NamedLicense {
    license: {
      name: string
      acknowledgement?: Enums.LicenseAcknowledgement
      text?: Attachment
      url?: string
    }
  }

  export interface SpdxLicense {
    license: {
      /* see http://cyclonedx.org/schema/spdx */
      id: SpdxId
      acknowledgement?: Enums.LicenseAcknowledgement
      text?: Attachment
      url?: string
    }
  }

  export interface LicenseExpression {
    expression: string
    acknowledgement?: Enums.LicenseAcknowledgement
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
    /* eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents -- as of spec */
    url: JsonSchema.IriReference | BomLink
    type: Enums.ExternalReferenceType
    hashes?: Hash[]
    comment?: string
  }

  export interface Attachment {
    content?: string
    contentType?: string
    encoding?: Enums.AttachmentEncoding
  }

  export interface Property {
    name?: string
    value?: string
  }

  export interface Dependency {
    ref: RefLinkType
    dependsOn?: RefLinkType[]
  }

  export interface Vulnerability {
    'bom-ref'?: RefType
    id?: string
    source?: Vulnerability.Source
    references?: Vulnerability.Reference[]
    ratings?: Vulnerability.Rating[]
    cwes?: CWE[]
    description?: string
    detail?: string
    recommendation?: string
    advisories?: Vulnerability.Advisory[]
    created?: JsonSchema.DateTime
    published?: JsonSchema.DateTime
    updated?: JsonSchema.DateTime
    credits?: Vulnerability.Credits
    tools?: ToolsType
    analysis?: Vulnerability.Analysis
    affects?: Vulnerability.Affect[]
    properties?: Property[]
  }

  /* eslint-disable-next-line @typescript-eslint/no-namespace -- needed */
  export namespace Vulnerability {
    export interface Source {
      name?: string
      url?: string
    }

    export interface Reference {
      id: string
      source: Source
    }

    export interface Rating {
      source?: Source
      score?: number
      severity?: Enums.Vulnerability.Severity
      method?: Enums.Vulnerability.RatingMethod
      vector?: string
      justification?: string
    }

    export interface Advisory {
      title?: string
      url: JsonSchema.IriReference
    }

    export interface Credits {
      organizations?: OrganizationalEntity[]
      individuals?: OrganizationalContact[]
    }

    export interface Analysis {
      state?: Enums.Vulnerability.AnalysisState
      justification?: Enums.Vulnerability.AnalysisJustification
      response?: Enums.Vulnerability.AnalysisResponse[]
      detail?: string
    }

    export interface Affect {
      /* eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents -- as of spec */
      ref: RefLinkType | BomLinkElementType
      versions?: AffectedVersion[]
    }

    export interface AffectedSingleVersion {
      version: string
      status?: Enums.Vulnerability.AffectStatus
    }

    export interface AffectedVersionRange {
      range: string
      status?: Enums.Vulnerability.AffectStatus
    }

    export type AffectedVersion = AffectedSingleVersion | AffectedVersionRange
  }
}
