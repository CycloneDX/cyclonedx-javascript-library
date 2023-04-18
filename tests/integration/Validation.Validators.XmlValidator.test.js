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
    Validators: { XmlValidator }
  }
} = require('../../')

describe('Validation.Validators.XmlValidator', () => {
  [
    // none so far
  ].forEach((version) => {
    describe(version, () => {
      it('throws not implemented', async () => {
        const validator = new XmlValidator(version)
        return assert.rejects(
          () => validator.validate('<bom/>'),
          (err) => err instanceof NotImplementedError
        )
      })
    })
  });

  [
    Version.v1dot0,
    Version.v1dot1,
    Version.v1dot2,
    Version.v1dot3,
    Version.v1dot4
  ].forEach((version) => {
    describe(version, async () => {
      try {
        await import('libxmljs')
      } catch {
        it('throws MissingOptionalDependencyError', async () => {
          const validator = new XmlValidator(version)
          await assert.rejects(
            () => validator.validate('<bom/>'),
            (err) => err instanceof MissingOptionalDependencyError
          )
        })
        return
      }

      it('invalid throws', async () => {
        const validator = new XmlValidator(version)
        const input = `<?xml version="1.0" encoding="UTF-8"?>
<bom xmlns="http://cyclonedx.org/schema/bom/${version}">
  <components>
    <component type="library">
      <name>bar</name>
      <version>1.337</version>
      <unknown>undefined</unknown><!-- << undefined/additional property -->
    </component>
  </components>
</bom>`
        return assert.rejects(
          () => validator.validate(input),
          (err) => {
            assert.ok(err instanceof ValidationError)
            assert.match(err.message, new RegExp(`invalid.* CycloneDX ${escapeRegExp(version)}`, 'i'))
            assert.notStrictEqual(err.details, undefined)
            return true
          }
        )
      })

      it('valid passes', async () => {
        const validator = new XmlValidator(version)
        const input = `<?xml version="1.0" encoding="UTF-8"?>
<bom xmlns="http://cyclonedx.org/schema/bom/${version}">
  <components>
    <component type="library">
      <name>bar</name>
      <version>1.337</version>
      ${version === '1.0' ? '<modified>false</modified>' : ''}
    </component>
  </components>
</bom>`
        await validator.validate(input)
      })
    })
  })
})
