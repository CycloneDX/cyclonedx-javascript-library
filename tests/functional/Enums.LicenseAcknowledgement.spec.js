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
  Enums: { LicenseAcknowledgement },
  Spec: { Version },
  _Resources: { FILES: { CDX: { JSON_SCHEMA: CDX_JSON_SCHEMA } } }
} = require('../../')
const { getSpecEnum } = require('../_data/specLoader')
const { upperCamelCase } = require('../_helpers/stringFunctions')

suite('functional: LicenseAcknowledgement enum', () => {
  const specVersions = new Set([
    Version.v1dot6
  ])

  specVersions.forEach(specVersion =>
    suite(`from spec ${specVersion}`, () => {
      const knownValues = getSpecEnum(
        CDX_JSON_SCHEMA[specVersion],
        'licenseAcknowledgementEnumeration')
      knownValues.forEach(enumValue => {
        const expectedName = upperCamelCase(enumValue)
        test(`is known: ${expectedName} -> ${enumValue}`, () =>
          assert.strictEqual(LicenseAcknowledgement[expectedName], enumValue)
        )
        // test(`is supported: ${enumValue}`, () =>
        //  assert.strictEqual(SpecVersionDict[specVersion]?.supportsLicenseAcknowledgement(enumValue), true)
        // )
      })
      // const unknownValues = Object.values(LicenseAcknowledgement).filter(enumValue => !knownValues.includes(enumValue))
      // unknownValues.forEach(enumValue =>
      //  test(`not supported: ${enumValue}`, () =>
      //    assert.strictEqual(SpecVersionDict[specVersion]?.supportsLicenseAcknowledgement(enumValue), false)
      //  )
      // )
    })
  )
})
