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

/* eslint-disable jsdoc/valid-types --
   JSDoc is still missing support for tuples - https://github.com/jsdoc/jsdoc/issues/1703
*/
/**
 * Prioritized list of possible implementations.
 * @type {[string, function():(Function|*)][]}
 */
const possibleStringifiers = [
  ['xmlbuilder2', () => require('./__stringifiers/xmlbuilder2')]
  // ... add others here, pull-requests welcome!
]
/* eslint-enable jsdoc/valid-types */

module.exports = function () {
  throw new Error(
    'No stringifier available.' +
    ' Please install any of the optional dependencies: ' +
    possibleStringifiers.map(kv => kv[0]).join(', ')
  )
}
module.exports.fails = true

for (const [, getStringifier] of possibleStringifiers) {
  try {
    const possibleStringifier = getStringifier()
    if (typeof possibleStringifier === 'function') {
      module.exports = possibleStringifier
      break
    }
  } catch {
    /* pass */
  }
}
