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

import * as _NpmjsUtility from '../contrib/fromNodePackageJson/utils'
import * as _LicenseUtility from '../contrib/license/utils.node'


export * from './index.common'

// region node-specifics

// region deprecated re-exports

/**
 * Deprecated — Alias of {@link Contrib.FromNodePackageJson.Utils}.
 *
 * @deprecated This re-export location is deprecated.
 * Import `Contrib.FromNodePackageJson.Utils` instead.
 * The exported symbol itself is NOT deprecated - only this import path.
 */
export const NpmjsUtility = _NpmjsUtility

/**
 * Deprecated — Alias of {@link Contrib.License.Utils}.
 *
 * @deprecated This re-export location is deprecated.
 * Import `Contrib.License.Utils` instead.
 * The exported symbol itself is NOT deprecated - only this import path.
 */
export const LicenseUtility = _LicenseUtility

// region deprecated re-exports

// endregion node-specifics
