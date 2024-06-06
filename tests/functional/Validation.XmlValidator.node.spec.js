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

const fs = require('fs')
const path = require('path')
const assert = require('assert')
const { suite, test, before } = require('mocha')
const { globSync } = require('fast-glob')

const {
  Validation: { XmlValidator },
  Spec: { Version }
} = require('../../')

before(function () {
  const { default: xmlValidator } = require('../../dist.node/_optPlug.node/xmlValidator')
  if (xmlValidator.fails) {
    this.skip()
  }
})

suite('Validation.XmlValidator functional', function () {
  this.timeout(60000);

  [
    Version.v1dot6,
    Version.v1dot5,
    Version.v1dot4,
    Version.v1dot3,
    Version.v1dot2,
    Version.v1dot1,
    Version.v1dot0
  ].forEach(version => {
    suite(version, () => {
      const validator = new XmlValidator(version)

      for (const file of globSync(path.resolve(__dirname, '..', '_data', 'schemaTestData', version, 'valid-*.xml'))) {
        test(path.basename(file, '.xml'), async () => {
          const error = await validator.validate(fs.readFileSync(file))
          assert.strictEqual(error, null)
        })
      }

      for (const file of globSync(path.resolve(__dirname, '..', '_data', 'schemaTestData', version, 'invalid-*.xml'))) {
        test(path.basename(file, '.xml'), async () => {
          const error = await validator.validate(fs.readFileSync(file))
          assert.notEqual(error, null)
        })
      }
    })
  })
})
