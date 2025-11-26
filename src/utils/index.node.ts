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

export * from './index.common'

// region node-specifics

/**
 * @deprecated This re-export location is deprecated.
 * Import from `Contrib.FromNodePackageJson.Utils` instead.
 * The exported utilities themselves are NOT deprecated - only this import path.
 */
export * as NpmjsUtility from '../contrib/fromNodePackageJson.node/utils'
/**
 * @deprecated This re-export location is deprecated.
 * Import from `Contrib.License.Utils` instead.
 * The exported utilities themselves are NOT deprecated - only this import path.
 */
export * as LicenseUtility from '../contrib/license/utils.node'

// endregion node-specifics
