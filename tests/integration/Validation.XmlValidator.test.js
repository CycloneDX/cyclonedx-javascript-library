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

let hasDep = true
try {
  require('libxmljs2')
} catch {
  hasDep = false
}

const {
  Spec: { Version },
  Validation: {
    NotImplementedError, MissingOptionalDependencyError,
    XmlValidator
  }
} = require('../../')

describe('Validation.XmlValidator', () => {
  [
    // none so far
  ].forEach((version) => describe(version, () => {
    it('throws not implemented', async () => {
      const validator = new XmlValidator(version)
      await assert.rejects(
        validator.validate('<bom/>'),
        (err) => err instanceof NotImplementedError
      )
    })
  }));

  [
    Version.v1dot6,
    Version.v1dot5,
    Version.v1dot4,
    Version.v1dot3,
    Version.v1dot2,
    Version.v1dot1,
    Version.v1dot0
  ].forEach((version) => describe(version, () => {
    if (!hasDep) {
      it('throws MissingOptionalDependencyError', async () => {
        const validator = new XmlValidator(version)
        await assert.rejects(
          validator.validate('<bom/>'),
          (err) => err instanceof MissingOptionalDependencyError
        )
      })
      return // skip other tests
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
      const validationError = await validator.validate(input)
      assert.notStrictEqual(validationError, null)
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
      const validationError = await validator.validate(input)
      assert.strictEqual(validationError, null)
    })

    it('is not vulnerable to advisories/GHSA-mjr4-7xg5-pfvh', async () => {
      /* report:
      see https://github.com/advisories/GHSA-mjr4-7xg5-pfvh
      see https://github.com/CycloneDX/cyclonedx-javascript-library/issues/1061
      */
      const validator = new XmlValidator(version)
      /* POC payload:
      see https://research.jfrog.com/vulnerabilities/libxmljs2-attrs-type-confusion-rce-jfsa-2024-001034097/#poc
       */
      const input = `<?xml version="1.0" encoding="UTF-8"?>
        <!DOCTYPE note
        [
        <!ENTITY writer "` + 'A'.repeat(0x1234) + `">
        ]>
        <bom xmlns="http://cyclonedx.org/schema/bom/${version}">
          <components>
            <component type="library">
              <name>&writer;</name><!-- << XML external entity (XXE) injection -->
              <version>1.337</version>
              ${version === '1.0' ? '<modified>false</modified>' : ''}
            </component>
          </components>
        </bom>`
      const validationError = await validator.validate(input)
      assert.strictEqual(validationError, null)
    })

    it('is not vulnerable to advisories/GHSA-78h3-pg4x-j8cv', async () => {
      /* report:
      see https://github.com/advisories/GHSA-78h3-pg4x-j8cv
      see https://github.com/CycloneDX/cyclonedx-javascript-library/issues/1061
      */
      const validator = new XmlValidator(version)
      /* POC payload:
      see https://research.jfrog.com/vulnerabilities/libxmljs2-namespaces-type-confusion-rce-jfsa-2024-001034098/#poc
      */
      const input = `<?xml version="1.0" encoding="UTF-8"?>
        <!DOCTYPE note
        [
        <!ENTITY writer PUBLIC "` + 'A'.repeat(8) + 'B'.repeat(8) + 'C'.repeat(8) + 'D'.repeat(8) + 'P'.repeat(8) + `" "JFrog Security">
        ]>
        <bom xmlns="http://cyclonedx.org/schema/bom/${version}">
          <components>
            <component type="library">
              <name>&writer;</name><!-- << XML external entity (XXE) injection -->
              <version>1.337</version>
              ${version === '1.0' ? '<modified>false</modified>' : ''}
            </component>
          </components>
        </bom>`
      const validationError = await validator.validate(input)
      assert.strictEqual(validationError, null)
    })
  }))
})
