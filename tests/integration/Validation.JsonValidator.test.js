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

const {
  Spec: { Version },
  Validation: {
    NotImplementedError, MissingOptionalDependencyError,
    JsonValidator
  }
} = require('../../')

const { default: jsonValidator } = require('../../dist.node/_optPlug.node/jsonValidator')

describe('integration.Validation.JsonValidator', () => {
  const expectMissingDepError = jsonValidator.fails ?? false;

  [
    'somthing-unexpected',
    Version.v1dot0,
    Version.v1dot1
  ].forEach((version) => describe(version, () => {
    it('throws not implemented', async () => {
      const validator = new JsonValidator(version)
      await assert.rejects(
        validator.validate('{}'),
        (err) => err instanceof NotImplementedError
      )
    })
  }));

  [
    Version.v1dot6,
    Version.v1dot5,
    Version.v1dot4,
    Version.v1dot3,
    Version.v1dot2
  ].forEach((version) => describe(version, () => {
    if (expectMissingDepError) {
      it('throws MissingOptionalDependencyError', async () => {
        const validator = new JsonValidator(version)
        await assert.rejects(
          validator.validate('{}'),
          (err) => err instanceof MissingOptionalDependencyError
        )
      })
      return // skip other tests
    }

    it('invalid throws', async () => {
      const validator = new JsonValidator(version)
      const input = JSON.stringify({
        bomFormat: 'CycloneDX',
        specVersion: version,
        components: [{
          type: 'library',
          name: 'bar',
          unknown: 'undefined' // << undefined/additional property
        }]
      })
      const validationError = await validator.validate(input)
      assert.notStrictEqual(validationError, null)
    })

    it('valid passes', async () => {
      const validator = new JsonValidator(version)
      const input = JSON.stringify({
        $schema: `http://cyclonedx.org/schema/bom-${version}.schema.json`,
        bomFormat: 'CycloneDX',
        specVersion: version,
        components: [{
          type: 'library',
          name: 'foo',
          version: '1.337'
        }]
      })
      const validationError = await validator.validate(input)
      assert.strictEqual(validationError, null)
    })
  }))
})
