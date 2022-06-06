'use strict';
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

const possibileStringifiers = {
  // prioritized list of possible implementations
  xmlbuilder2: 'xmlbuilder2'
}

const stringifiers = {}
let stringifier
for (const [name, file] of Object.entries(possibileStringifiers)) {
  try {
    stringifier = require(`./lib/stringifiers/${file}`)
    if (typeof stringifier === 'function') {
      stringifiers[name] = stringifier
    }
  } catch {
    /* pass */
  }
}

module.exports.stringifiers = Object.freeze(stringifiers)
module.exports.stringify = Object.values(module.exports.stringifiers)[0]
module.exports.stringifyFallback = module.exports.stringify ?? function () {
  throw new TypeError('No stringifier available. Please install one of the optional xml libraries.')
}
