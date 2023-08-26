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
import type { Format, Version } from './'

/**
 * This interface is not intended to be public API.
 * Changes to this interface are treated as non-breaking, because this interface is not public loadable.
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
