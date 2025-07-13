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
 * Intended to represent normalized data structures
 * based on [PackageJson spec](https://github.com/SchemaStore/schemastore/blob/master/src/schemas/json/package.json)
 * and explained by [PackageJson description](https://docs.npmjs.com/cli/v9/configuring-npm/package-json).
 *
 * Normalization should be done downstream, for example
 * via [`normalize-package-data`](https://www.npmjs.com/package/normalize-package-data).
 */
export interface PackageJson {
  name?: string
  version?: string
  description?: string
  license?: string
  licenses?: Array<{
    type?: string
    url?: string
  }>
  author?: string | {
    name?: string
    email?: string
  }
  bugs?: string | {
    url?: string
  }
  homepage?: string
  repository?: string | {
    type?: string
    url?: string
    directory?: string
  }
  // ... to be continued
  dist?: any // see https://github.com/CycloneDX/cyclonedx-node-npm/issues/1300
}


/* TODO: write type assertion
export function isPackageJsonNode (value: any): value is PackageJsonNode {
  return...
}
*/
