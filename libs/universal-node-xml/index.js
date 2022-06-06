'use strict'
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

const possibileStringifiers = [
  // prioritized list of possible implementations
  'xmlbuilder2'
]

module.exports.stringify = undefined
let possibileStringifier
for (const file of possibileStringifiers) {
  try {
    possibileStringifier = require(`./stringifiers/${file}`)
    if (typeof possibileStringifier === 'function') {
      module.exports.stringify = possibileStringifier
      break
    }
  } catch {
    /* pass */
  }
}

module.exports.stringifyFallback = module.exports.stringify ?? function () {
  throw new TypeError('No stringifier available. Please install one of the optional xml libraries.')
}
