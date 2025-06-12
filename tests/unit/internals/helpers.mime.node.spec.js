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

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  guessMimeTypeForLicenseFile
} = require('../../../dist.node/_helpers/mime.node.js')

suite('unit: internals: helpers.mime.getMimeForLicenseFile', () => {
  for (const [fileName, expected] of [
    ['LICENCE', 'text/plain'],
    ['site.html', 'text/html'],
    ['license.md', 'text/markdown'],
    ['info.xml', 'text/xml'],
    ['UNKNOWN', 'text/plain'],
    ['LICENCE.MIT', 'text/plain'],
    ['mit.license', 'text/plain']
  ]) {
    test(fileName, () => {
      const value = guessMimeTypeForLicenseFile(fileName)
      assert.strictEqual(value, expected)
    })
  }
})
