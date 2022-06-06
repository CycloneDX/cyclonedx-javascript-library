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

try {
  const { create } = require('xmlbuilder2')
} catch {
  return
}
if (!create) {
  return
}

function stringify (element, options) {
  let indent = ''
  if (typeof options.space === 'number' && options.space > 0) {
    indent = ' '.repeat(options.space)
  } else if (typeof options.space === 'string') {
    indent = options.space
  }
  return create(transform(element)).end({ format: 'xml', prettyPrint: indent.length > 0, indent })
}

function transform (element) {
  return {
    // TODO
  }
}

module.exports = stringify
