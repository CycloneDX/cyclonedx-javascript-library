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
import type { CPE, Integer, UrnUuid } from '../../types'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace JsonSchema {

  /**
   * @see isIriReference
   */
  export type IriReference = string
  /**
   * Test whether format is JSON::iri-reference - best-effort.
   *
   * @TODO add more validation according to spec
   * @see {@link https://datatracker.ietf.org/doc/html/rfc3987 | RFC 3987}
   */
  export function isIriReference (value: IriReference | any): value is IriReference {
    return typeof value === 'string' &&
      value.length > 0
  }

  /**
   * @see isIdnEmail
   */
  export type IdnEmail = string
  /**
   * Test whether format is JSON::idn-email - best-effort.
   *
   * @TODO add more validation according to spec
   * @see {@link https://datatracker.ietf.org/doc/html/rfc6531 | RFC 6531}
   */
  export function isIdnEmail (value: IdnEmail | any): value is IdnEmail {
    return typeof value === 'string' &&
      value.length > 0
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
    properties?: Property[]
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
      /* see http://cyclonedx.org/schema/spdx */
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

  export interface Property {
    name?: string
    value?: string
  }

  export interface Dependency {
    ref: RefType
    dependsOn?: RefType[]
  }

}
