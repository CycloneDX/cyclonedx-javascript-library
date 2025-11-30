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

/**
 * Node-specifics.
 *
 * Intended to run on normalized data structures
 * based on [PackageJson spec](https://github.com/SchemaStore/schemastore/blob/master/src/schemas/json/package.json)
 * and explained by [PackageJson description](https://docs.npmjs.com/cli/v9/configuring-npm/package-json).
 * Normalization should be done downstream, for example via [`normalize-package-data`](https://www.npmjs.com/package/normalize-package-data).
 */

export * as Builders from './builders'
export * as Factories from './factories'
export * as Types from './types'
export * as Utils from './utils'

// do not export the _helpers, they are for internal use only
