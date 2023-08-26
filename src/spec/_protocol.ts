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
 * See the public exported constants that provide objects implementing this interface.
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
}

/**
 * This class was never intended to be public API,
 *
 * This is a helper to get the exact spec-versions implemented according to {@link _SpecProtocol}.
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
    supportsMetadataLifecycles: boolean
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
    return this.#vulnerabilityRatingMethods.has(rm)
  }

  get supportsComponentEvidence (): boolean {
    return this.#supportsComponentEvidence
  }

  get supportsMetadataLifecycles (): boolean {
    return this.#supportsMetadataLifecycles
  }
}
