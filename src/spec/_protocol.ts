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

import type { ComponentType, ExternalReferenceType, HashAlgorithm, Vulnerability } from '../enums'
import type { HashContent } from '../models'
import type { Format, Version } from './enums'

/**
 * This interface is not intended to be public API.
 * This interface may be affected by breaking changes without notice.
 *
 * See the public exported constants, like {@link Spec.Spec1dot4}, that provide objects implementing this interface.
 * See also {@link Spec.SpecVersionDict} for implementations.
 */
export interface _SpecProtocol {
  version: Version
  supportsFormat: (f: Format | any) => boolean
  supportsComponentType: (ct: ComponentType | any) => boolean
  supportsHashAlgorithm: (ha: HashAlgorithm | any) => boolean
  supportsHashValue: (hv: HashContent | any) => boolean
  supportsExternalReferenceType: (ert: ExternalReferenceType | any) => boolean
  supportsDependencyGraph: boolean
  supportsToolReferences: boolean
  requiresComponentVersion: boolean
  supportsProperties: (model: any) => boolean
  supportsVulnerabilities: boolean
  supportsVulnerabilityRatingMethod: (rm: Vulnerability.RatingMethod | any) => boolean
  supportsComponentEvidence: boolean
  supportsMetadataLifecycles: boolean
  supportsMetadataLicenses: boolean
  supportsMetadataProperties: boolean
  supportsExternalReferenceHashes: boolean
  supportsLicenseAcknowledgement: boolean
  supportsServices: boolean
  supportsToolsComponentsServices: boolean
}

/**
 * This class was never intended to be public API,
 *
 * This is a helper to get the exact spec-versions implemented according to {@link _SpecProtocol | Specification}.
 *
 * @internal as this class may be affected by breaking changes without notice
 */
export class _Spec implements _SpecProtocol {
  private readonly _version: Version
  private readonly _formats: ReadonlySet<Format>
  private readonly _componentTypes: ReadonlySet<ComponentType>
  private readonly _hashAlgorithms: ReadonlySet<HashAlgorithm>
  private readonly _hashValuePattern: RegExp
  private readonly _externalReferenceTypes: ReadonlySet<ExternalReferenceType>
  private readonly _vulnerabilityRatingMethods: ReadonlySet<Vulnerability.RatingMethod>
  private readonly _supportsDependencyGraph: boolean
  private readonly _supportsToolReferences: boolean
  private readonly _requiresComponentVersion: boolean
  private readonly _supportsProperties: boolean
  private readonly _supportsVulnerabilities: boolean
  private readonly _supportsComponentEvidence: boolean
  private readonly _supportsMetadataLifecycles: boolean
  private readonly _supportsMetadataLicenses: boolean
  private readonly _supportsMetadataProperties: boolean
  private readonly _supportsExternalReferenceHashes: boolean
  private readonly _supportsLicenseAcknowledgement: boolean
  private readonly _supportsServices: boolean
  private readonly _supportsToolsComponentsServices: boolean

  /* eslint-disable-next-line @typescript-eslint/max-params -- architectural decision */
  constructor (
    version: Version,
    formats: Iterable<Format>,
    componentTypes: Iterable<ComponentType>,
    hashAlgorithms: Iterable<HashAlgorithm>,
    hashValuePattern: RegExp,
    externalReferenceTypes: Iterable<ExternalReferenceType>,
    supportsDependencyGraph: boolean,
    supportsToolReferences: boolean,
    requiresComponentVersion: boolean,
    supportsProperties: boolean,
    supportsVulnerabilities: boolean,
    vulnerabilityRatingMethods: Iterable<Vulnerability.RatingMethod>,
    supportsComponentEvidence: boolean,
    supportsMetadataLifecycles: boolean,
    supportsMetadataLicenses: boolean,
    supportsMetadataProperties: boolean,
    supportsExternalReferenceHashes: boolean,
    supportsLicenseAcknowledgement: boolean,
    supportsServices: boolean,
    supportsToolsComponentsServices: boolean
  ) {
    this._version = version
    this._formats = new Set(formats)
    this._componentTypes = new Set(componentTypes)
    this._hashAlgorithms = new Set(hashAlgorithms)
    this._hashValuePattern = hashValuePattern
    this._externalReferenceTypes = new Set(externalReferenceTypes)
    this._supportsDependencyGraph = supportsDependencyGraph
    this._supportsToolReferences = supportsToolReferences
    this._requiresComponentVersion = requiresComponentVersion
    this._supportsProperties = supportsProperties
    this._supportsVulnerabilities = supportsVulnerabilities
    this._vulnerabilityRatingMethods = new Set(vulnerabilityRatingMethods)
    this._supportsComponentEvidence = supportsComponentEvidence
    this._supportsMetadataLifecycles = supportsMetadataLifecycles
    this._supportsMetadataLicenses = supportsMetadataLicenses
    this._supportsMetadataProperties = supportsMetadataProperties
    this._supportsExternalReferenceHashes = supportsExternalReferenceHashes
    this._supportsLicenseAcknowledgement = supportsLicenseAcknowledgement
    this._supportsServices = supportsServices
    this._supportsToolsComponentsServices = supportsToolsComponentsServices
  }

  get version (): Version {
    return this._version
  }

  supportsFormat (f: Format | any): boolean {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- fix */
    return this._formats.has(f)
  }

  supportsComponentType (ct: ComponentType | any): boolean {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- fix */
    return this._componentTypes.has(ct)
  }

  supportsHashAlgorithm (ha: HashAlgorithm | any): boolean {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- fix */
    return this._hashAlgorithms.has(ha)
  }

  supportsHashValue (hv: HashContent | any): boolean {
    return typeof hv === 'string' &&
        this._hashValuePattern.test(hv)
  }

  supportsExternalReferenceType (ert: ExternalReferenceType | any): boolean {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- fix */
    return this._externalReferenceTypes.has(ert)
  }

  get supportsDependencyGraph (): boolean {
    return this._supportsDependencyGraph
  }

  get supportsToolReferences (): boolean {
    return this._supportsToolReferences
  }

  get requiresComponentVersion (): boolean {
    return this._requiresComponentVersion
  }

  supportsProperties (): boolean {
    // currently a global allow/deny -- might work based on input, in the future
    return this._supportsProperties
  }

  get supportsVulnerabilities (): boolean {
    return this._supportsVulnerabilities
  }

  supportsVulnerabilityRatingMethod (rm: Vulnerability.RatingMethod | any): boolean {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- any */
    return this._vulnerabilityRatingMethods.has(rm)
  }

  get supportsComponentEvidence (): boolean {
    return this._supportsComponentEvidence
  }

  get supportsMetadataLifecycles (): boolean {
    return this._supportsMetadataLifecycles
  }

  get supportsMetadataLicenses (): boolean {
    return this._supportsMetadataLicenses
  }

  get supportsMetadataProperties (): boolean {
    return this._supportsMetadataProperties
  }

  get supportsExternalReferenceHashes (): boolean {
    return this._supportsExternalReferenceHashes
  }

  get supportsLicenseAcknowledgement (): boolean {
    return this._supportsLicenseAcknowledgement
  }

  get supportsServices (): boolean {
    return this._supportsServices
  }

  get supportsToolsComponentsServices(): boolean {
    return this._supportsToolsComponentsServices
  }
}
