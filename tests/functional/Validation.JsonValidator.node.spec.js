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
const fs = require('node:fs')
const path = require('node:path')

const { globSync } = require('fast-glob')
const { before, suite, test } = require('mocha')

const {
  Validation: { JsonValidator, JsonStrictValidator },
  Spec: { Version }
} = require('../../')

before(function () {
  const { default: jsonValidator } = require('../../dist.node/_optPlug.node/jsonValidator')
  if (jsonValidator.fails) {
    this.skip()
  }
})

suite('functional: Validation.JsonValidator functional', function () {
  this.timeout(60000);

  [
    Version.v1dot6,
    Version.v1dot5,
    Version.v1dot4,
    Version.v1dot3,
    Version.v1dot2
  ].forEach(version => {
    suite(version, () => {
      const validator = new JsonValidator(version)

      for (const file of globSync(path.resolve(__dirname, '..', '_data', 'schemaTestData', version, 'valid-*.json'))) {
        test(path.basename(file, '.json'), async () => {
          const error = await validator.validate(fs.readFileSync(file))
          assert.strictEqual(error, null)
        })
      }

      for (const file of globSync(path.resolve(__dirname, '..', '_data', 'schemaTestData', version, 'invalid-*.json'))) {
        test(path.basename(file, '.json'), async () => {
          const error = await validator.validate(fs.readFileSync(file))
          assert.notEqual(error, null)
        })
      }
    })
  })
})

suite('functional: Validation.JsonStrictValidator functional', function () {
  this.timeout(60000);

  [
    Version.v1dot6,
    Version.v1dot5,
    Version.v1dot4,
    Version.v1dot3,
    Version.v1dot2
  ].forEach(version => {
    suite(version, () => {
      const validator = new JsonStrictValidator(version)

      for (const file of globSync(path.resolve(__dirname, '..', '_data', 'schemaTestData', version, 'valid-*.json'))) {
        test(path.basename(file, '.json'), async () => {
          const error = await validator.validate(fs.readFileSync(file))
          assert.strictEqual(error, null)
        })
      }

      for (const file of globSync(path.resolve(__dirname, '..', '_data', 'schemaTestData', version, 'invalid-*.json'))) {
        test(path.basename(file, '.json'), async () => {
          const error = await validator.validate(fs.readFileSync(file))
          assert.notEqual(error, null)
        })
      }
    })
  })
})
