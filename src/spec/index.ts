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

import { ComponentType, ExternalReferenceType, HashAlgorithm, Vulnerability } from '../enums'
import type { HashContent } from '../models'
import type { _SpecProtocol } from './_protocol'

export enum Version {
  v1dot5 = '1.5',
  v1dot4 = '1.4',
  v1dot3 = '1.3',
  v1dot2 = '1.2',
  v1dot1 = '1.1',
  v1dot0 = '1.0',
}

export enum Format {
  XML = 'xml',
  JSON = 'json',
}

export class UnsupportedFormatError extends Error {
}

/**
 * This class was never intended to be public API, but
 * it is a helper to get the exact spec-versions implemented according to {@link _SpecProtocol}.
 *
 * See the ready-made constants that represent implementations of this class:
 * - {@link Spec1dot2}
 * - {@link Spec1dot3}
 * - {@link Spec1dot4}
 * - {@link Spec1dot5}
 */
class _Spec implements _SpecProtocol {
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

/** Specification v1.2 */
export const Spec1dot2: Readonly<_SpecProtocol> = Object.freeze(new _Spec(
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
  ],
  true,
  false,
  true,
  false,
  false,
  [],
  false,
  false
))

/** Specification v1.3 */
export const Spec1dot3: Readonly<_SpecProtocol> = Object.freeze(new _Spec(
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
  ],
  true,
  false,
  true,
  true,
  false,
  [],
  true,
  false
))

/** Specification v1.4 */
export const Spec1dot4: Readonly<_SpecProtocol> = Object.freeze(new _Spec(
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
  ],
  true,
  true,
  false,
  true,
  true,
  [
    Vulnerability.RatingMethod.CVSSv2,
    Vulnerability.RatingMethod.CVSSv3,
    Vulnerability.RatingMethod.CVSSv31,
    Vulnerability.RatingMethod.OWASP,
    Vulnerability.RatingMethod.Other
  ],
  true,
  false
))

/** Specification v1.5 */
export const Spec1dot5: Readonly<_SpecProtocol> = Object.freeze(new _Spec(
  Version.v1dot5,
  [
    Format.XML,
    Format.JSON
  ],
  [
    ComponentType.Application,
    ComponentType.Framework,
    ComponentType.Library,
    ComponentType.Container,
    ComponentType.Platform,
    ComponentType.OperatingSystem,
    ComponentType.Device,
    ComponentType.DeviceDriver,
    ComponentType.Firmware,
    ComponentType.File,
    ComponentType.MachineLearningModel,
    ComponentType.Data
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
    ExternalReferenceType.DistributionIntake,
    ExternalReferenceType.License,
    ExternalReferenceType.BuildMeta,
    ExternalReferenceType.BuildSystem,
    ExternalReferenceType.ReleaseNotes,
    ExternalReferenceType.SecurityContact,
    ExternalReferenceType.ModelCard,
    ExternalReferenceType.Log,
    ExternalReferenceType.Configuration,
    ExternalReferenceType.Evidence,
    ExternalReferenceType.Formulation,
    ExternalReferenceType.Attestation,
    ExternalReferenceType.ThreatModel,
    ExternalReferenceType.AdversaryModel,
    ExternalReferenceType.RiskAssessment,
    ExternalReferenceType.VulnerabilityAssertion,
    ExternalReferenceType.ExploitabilityStatement,
    ExternalReferenceType.PentestReport,
    ExternalReferenceType.StaticAnalysisReport,
    ExternalReferenceType.DynamicAnalysisReport,
    ExternalReferenceType.RuntimeAnalysisReport,
    ExternalReferenceType.ComponentAnalysisReport,
    ExternalReferenceType.MaturityReport,
    ExternalReferenceType.CertificationReport,
    ExternalReferenceType.CodifiedInfrastructure,
    ExternalReferenceType.QualityMetrics,
    ExternalReferenceType.POAM,
    ExternalReferenceType.Other
  ],
  true,
  true,
  false,
  true,
  true,
  [
    Vulnerability.RatingMethod.CVSSv2,
    Vulnerability.RatingMethod.CVSSv3,
    Vulnerability.RatingMethod.CVSSv31,
    Vulnerability.RatingMethod.CVSSv4,
    Vulnerability.RatingMethod.OWASP,
    Vulnerability.RatingMethod.SSVC,
    Vulnerability.RatingMethod.Other
  ],
  true,
  true
))

export const SpecVersionDict: Readonly<Partial<Record<Version, Readonly<_SpecProtocol>>>> = Object.freeze({
  [Version.v1dot5]: Spec1dot5,
  [Version.v1dot4]: Spec1dot4,
  [Version.v1dot3]: Spec1dot3,
  [Version.v1dot2]: Spec1dot2
  // <= v1.1 is not implemented
})
