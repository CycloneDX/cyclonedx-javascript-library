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

import { ComponentType } from '../enums/componentType'
import { ExternalReferenceType } from '../enums/externalReferenceType'
import { HashAlgorithm } from '../enums/hashAlogorithm'
import { RatingMethod as VulnerabilityRatingMethod } from '../enums/vulnerability/ratingMethod'
import type { _SpecProtocol } from './_protocol'
import { _Spec } from './_protocol'
import { Format, Version } from './enums'

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
  false,
  false,
  false,
  false,
  false,
  true,
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
  false,
  true,
  true,
  true,
  false,
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
    VulnerabilityRatingMethod.CVSSv2,
    VulnerabilityRatingMethod.CVSSv3,
    VulnerabilityRatingMethod.CVSSv31,
    VulnerabilityRatingMethod.OWASP,
    VulnerabilityRatingMethod.Other
  ],
  true,
  false,
  true,
  true,
  true,
  false,
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
    VulnerabilityRatingMethod.CVSSv2,
    VulnerabilityRatingMethod.CVSSv3,
    VulnerabilityRatingMethod.CVSSv31,
    VulnerabilityRatingMethod.CVSSv4,
    VulnerabilityRatingMethod.OWASP,
    VulnerabilityRatingMethod.SSVC,
    VulnerabilityRatingMethod.Other
  ],
  true,
  true,
  true,
  true,
  true,
  false,
  true,
  true
))

/** Specification v1.6 */
export const Spec1dot6: Readonly<_SpecProtocol> = Object.freeze(new _Spec(
  Version.v1dot6,
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
    ComponentType.Data,
    ComponentType.CryptographicAsset
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
    ExternalReferenceType.SourceDistribution,
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
    ExternalReferenceType.ElectronicSignature,
    ExternalReferenceType.DigitalSignature,
    ExternalReferenceType.RFC9116,
    ExternalReferenceType.Other
  ],
  true,
  true,
  false,
  true,
  true,
  [
    VulnerabilityRatingMethod.CVSSv2,
    VulnerabilityRatingMethod.CVSSv3,
    VulnerabilityRatingMethod.CVSSv31,
    VulnerabilityRatingMethod.CVSSv4,
    VulnerabilityRatingMethod.OWASP,
    VulnerabilityRatingMethod.SSVC,
    VulnerabilityRatingMethod.Other
  ],
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true
))

export const SpecVersionDict: Readonly<Partial<Record<Version, Readonly<_SpecProtocol>>>> = Object.freeze({
  [Version.v1dot6]: Spec1dot6,
  [Version.v1dot5]: Spec1dot5,
  [Version.v1dot4]: Spec1dot4,
  [Version.v1dot3]: Spec1dot3,
  [Version.v1dot2]: Spec1dot2
  // <= v1.1 is not implemented
})
