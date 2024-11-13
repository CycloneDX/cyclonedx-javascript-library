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
  readonly #version: Version
  readonly #formats: ReadonlySet<Format>
  readonly #componentTypes: ReadonlySet<ComponentType>
  readonly #hashAlgorithms: ReadonlySet<HashAlgorithm>
  readonly #hashValuePattern: RegExp
  readonly #externalReferenceTypes: ReadonlySet<ExternalReferenceType>
  readonly #vulnerabilityRatingMethods: ReadonlySet<Vulnerability.RatingMethod>
  readonly #supportsDependencyGraph: boolean
  readonly #supportsToolReferences: boolean
  readonly #requiresComponentVersion: boolean
  readonly #supportsProperties: boolean
  readonly #supportsVulnerabilities: boolean
  readonly #supportsComponentEvidence: boolean
  readonly #supportsMetadataLifecycles: boolean
  readonly #supportsMetadataLicenses: boolean
  readonly #supportsMetadataProperties: boolean
  readonly #supportsExternalReferenceHashes: boolean
  readonly #supportsLicenseAcknowledgement: boolean
  readonly #supportsServices: boolean
  readonly #supportsToolsComponentsServices: boolean

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
    this.#version = version
    this.#formats = new Set(formats)
    this.#componentTypes = new Set(componentTypes)
    this.#hashAlgorithms = new Set(hashAlgorithms)
    this.#hashValuePattern = hashValuePattern
    this.#externalReferenceTypes = new Set(externalReferenceTypes)
    this.#supportsDependencyGraph = supportsDependencyGraph
    this.#supportsToolReferences = supportsToolReferences
    this.#requiresComponentVersion = requiresComponentVersion
    this.#supportsProperties = supportsProperties
    this.#supportsVulnerabilities = supportsVulnerabilities
    this.#vulnerabilityRatingMethods = new Set(vulnerabilityRatingMethods)
    this.#supportsComponentEvidence = supportsComponentEvidence
    this.#supportsMetadataLifecycles = supportsMetadataLifecycles
    this.#supportsMetadataLicenses = supportsMetadataLicenses
    this.#supportsMetadataProperties = supportsMetadataProperties
    this.#supportsExternalReferenceHashes = supportsExternalReferenceHashes
    this.#supportsLicenseAcknowledgement = supportsLicenseAcknowledgement
    this.#supportsServices = supportsServices
    this.#supportsToolsComponentsServices = supportsToolsComponentsServices
  }

  get version (): Version {
    return this.#version
  }

  supportsFormat (f: Format | any): boolean {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- fix */
    return this.#formats.has(f)
  }

  supportsComponentType (ct: ComponentType | any): boolean {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- fix */
    return this.#componentTypes.has(ct)
  }

  supportsHashAlgorithm (ha: HashAlgorithm | any): boolean {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- fix */
    return this.#hashAlgorithms.has(ha)
  }

  supportsHashValue (hv: HashContent | any): boolean {
    return typeof hv === 'string' &&
        this.#hashValuePattern.test(hv)
  }

  supportsExternalReferenceType (ert: ExternalReferenceType | any): boolean {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- fix */
    return this.#externalReferenceTypes.has(ert)
  }

  get supportsDependencyGraph (): boolean {
    return this.#supportsDependencyGraph
  }

  get supportsToolReferences (): boolean {
    return this.#supportsToolReferences
  }

  get requiresComponentVersion (): boolean {
    return this.#requiresComponentVersion
  }

  supportsProperties (): boolean {
    // currently a global allow/deny -- might work based on input, in the future
    return this.#supportsProperties
  }

  get supportsVulnerabilities (): boolean {
    return this.#supportsVulnerabilities
  }

  supportsVulnerabilityRatingMethod (rm: Vulnerability.RatingMethod | any): boolean {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- any */
    return this.#vulnerabilityRatingMethods.has(rm)
  }

  get supportsComponentEvidence (): boolean {
    return this.#supportsComponentEvidence
  }

  get supportsMetadataLifecycles (): boolean {
    return this.#supportsMetadataLifecycles
  }

  get supportsMetadataLicenses (): boolean {
    return this.#supportsMetadataLicenses
  }

  get supportsMetadataProperties (): boolean {
    return this.#supportsMetadataProperties
  }

  get supportsExternalReferenceHashes (): boolean {
    return this.#supportsExternalReferenceHashes
  }

  get supportsLicenseAcknowledgement (): boolean {
    return this.#supportsLicenseAcknowledgement
  }

  get supportsServices (): boolean {
    return this.#supportsServices
  }

  get supportsToolsComponentsServices(): boolean {
    return this.#supportsToolsComponentsServices
  }
}
