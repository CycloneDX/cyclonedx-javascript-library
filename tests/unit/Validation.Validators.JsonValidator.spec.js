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

const assert = require('assert')
const { suite, test } = require('mocha')

const {
  Spec: { Version },
  Validation: {
    ValidationError,
    Validators: {
      JsonValidator, JsonStrictValidator
    }
  }
} = require('../../')

const missingOptionalDepsRE = /no JSON validator available/i

suite('Validation.Validators.JsonValidator', () => {
  [
    Version.v1dot0,
    Version.v1dot1
  ].forEach((version) => {
    test(`${version} throws`, async () => {
      const input = { foo: 'bar' }
      await assert.rejects(async () => {
        await (new JsonValidator(version)).validate(input)
      }, (err) => {
        assert.ok(err instanceof ValidationError)
        assert.match(err.message, /not implemented/i)
        return true
      })
      assert.deepStrictEqual(input, { foo: 'bar' })
    })
  });

  [
    Version.v1dot2,
    Version.v1dot3,
    Version.v1dot4
  ].forEach((version) => {
    test(`${version} invalid throws`, async () => {
      const input = {}
      await assert.rejects(async () => {
        await (new JsonValidator(version)).validate(input)
      }, (err) => {
        if (missingOptionalDepsRE.test(err.message)) {
          return true
        }
        assert.ok(err instanceof ValidationError)
        assert.match(err.message, new RegExp(`invalid.* CycloneDX ${version}`, 'i'))
        assert.notStrictEqual(err.details, undefined)
        return true
      })
      assert.deepStrictEqual(input, {})
    })

    test(`${version} valid`, async () => {
      const input = {
        bomFormat: 'CycloneDX',
        specVersion: version
      }
      try {
        await (new JsonValidator(version)).validate(input)
      } catch (err) {
        if (!missingOptionalDepsRE.test(err.message)) {
          throw err
        }
      }
      assert.deepStrictEqual(input, {
        bomFormat: 'CycloneDX',
        specVersion: version
      })
    })
  })

})
