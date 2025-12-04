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

import {parsePackageIntegrity as _parsePackageIntegrity, defaultRegistryMatcher as _defaultRegistryMatcher} from '../contrib/fromNodePackageJson/utils'

/**
 * Deprecated — Alias of {@link Contrib.FromNodePackageJson.Utils.parsePackageIntegrity}.
 *
 * @deprecated This re-export location is deprecated.
 * Import `Contrib.FromNodePackageJson.Utils.parsePackageIntegrity` instead.
 * The exported symbol itself is NOT deprecated - only this import path.
 */
export const parsePackageIntegrity = _parsePackageIntegrity

/**
 * Deprecated — Alias of {@link Contrib.FromNodePackageJson.Utils.defaultRegistryMatcher}.
 *
 * @deprecated This re-export location is deprecated.
 * Import `Contrib.FromNodePackageJson.Utils.defaultRegistryMatcher` instead.
 * The exported symbol itself is NOT deprecated - only this import path.
 */
export const defaultRegistryMatcher = _defaultRegistryMatcher
