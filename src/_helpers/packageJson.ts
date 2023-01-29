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
 * Split name and group from a package's name.
 * Returns a tuple: [name, ?group]
 */
export function splitNameGroup (data: string): [string, string?] {
  return data[0] === '@'
    ? data.split('/', 2).reverse() as [string, string?]
    : [data]
}

/**
 * @see {@link https://github.com/SchemaStore/schemastore/blob/master/src/schemas/json/package.json | PackageJson spec}
 * @see {@link https://docs.npmjs.com/cli/v8/configuring-npm/package-json | PackageJson description}
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
    url?: string
    directory?: string
  }
  // .. to be continued
}
