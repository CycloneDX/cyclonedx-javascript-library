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
 *
 * Based on [PackageJson spec](https://nodejs.org/api/packages.html#name) there are no restrictions on it.
 * Having multiple slashes(`/`) is basically no issue.
 */
export function splitNameGroup (data: string): [string, string?] {
  const delimGroup = data.startsWith('@')
    ? data.indexOf('/', 2)
    : 0
  return delimGroup > 0
    ? [data.slice(delimGroup + 1), data.slice(0, delimGroup)]
    : [data, undefined]
}

