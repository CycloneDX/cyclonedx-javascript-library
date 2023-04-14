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
const { describe, it } = require('mocha')

const { escapeRegExp } = require('../_helpers/stringFunctions')

const {
  Spec: { Version },
  Validation: {
    ValidationError, NotImplementedError, MissingOptionalDependencyError,
    Validators: { JsonStrictValidator }
  }
} = require('../../')

describe('Validation.Validators.JsonStrictValidator', () => {
  [
    Version.v1dot0,
    Version.v1dot1
  ].forEach((version) => {
    describe(version, () => {
      it('throws not implemented', async () => {
        const validator = new JsonStrictValidator(version)
        const input = {
          bomFormat: 'CycloneDX',
          specVersion: version
        }
        return assert.rejects(
          () => validator.validate(input),
          (err) => err instanceof NotImplementedError
        ).finally(() => {
          assert.deepStrictEqual(input, {
            bomFormat: 'CycloneDX',
            specVersion: version
          }, 'data was altered unexpectedly')
        })
      })
    })
  });

  [
    Version.v1dot2,
    Version.v1dot3,
    Version.v1dot4
  ].forEach((version) => {
    describe(version, () => {
      it('invalid throws', async () => {
        const validator = new JsonStrictValidator(version)
        const input = {
          bomFormat: 'CycloneDX',
          specVersion: version,
          components: [{
            type: 'library',
            name: 'bar',
            unknown: 'undefined' // << undefined/additional property
          }]
        }
        return assert.rejects(
          () => validator.validate(input),
          (err) => {
            if (err instanceof MissingOptionalDependencyError) {
              return true // skip
            }
            assert.ok(err instanceof ValidationError)
            assert.match(err.message, new RegExp(`invalid.* CycloneDX ${escapeRegExp(version)}`, 'i'))
            assert.notStrictEqual(err.details, undefined)
            return true
          }
        ).finally(() => {
          assert.deepStrictEqual(input, {
            bomFormat: 'CycloneDX',
            specVersion: version,
            components: [{
              type: 'library',
              name: 'bar',
              unknown: 'undefined'
            }]
          }, 'data was altered unexpectedly')
        })
      })

      it('valid passes', async () => {
        const validator = new JsonStrictValidator(version)
        const input = {
          bomFormat: 'CycloneDX',
          specVersion: version,
          components: [{
            type: 'library',
            name: 'foo',
            version: '1.337'
          }]
        }
        try {
          await validator.validate(input)
        } catch (err) {
          if (!(err instanceof MissingOptionalDependencyError)) {
            assert.fail(err)
          }
        } finally {
          assert.deepStrictEqual(input, {
            bomFormat: 'CycloneDX',
            specVersion: version,
            components: [{
              type: 'library',
              name: 'foo',
              version: '1.337'
            }]
          }, 'data was altered unexpectedly')
        }
      })
    })
  })
})
