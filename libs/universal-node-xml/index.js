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

const possibleStringifiers = [
  // prioritized list of possible implementations
  'xmlbuilder2'
]

module.exports.stringify = function () {
  throw new Error(
    'No stringifier available.' +
    ' Please install any of the optional dependencies: ' +
    possibleStringifiers.join(', ')
  )
}
module.exports.stringify.fails = true

for (const file of possibleStringifiers) {
  try {
    const possibleStringifier = require(`./stringifiers/${file}`)
    if (typeof possibleStringifier === 'function') {
      module.exports.stringify = possibleStringifier
      break
    }
  } catch {
    /* pass */
  }
}
