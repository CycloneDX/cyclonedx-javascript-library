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
  _Resources: Resources,
  Spec: { Version }
} = require('../../../')
const makeValidator = require('../../../dist.node/_optPlug.node/xmlValidator').default

suite('internals: OpPlug.node.xmlValidator', () => {
  const schemaPath = Resources.FILES.CDX.XML_SCHEMA[Version.v1dot6]
  const validXML = `<?xml version="1.0" encoding="UTF-8"?>
    <bom xmlns="http://cyclonedx.org/schema/bom/1.6"></bom>`
  const invalidXML = `<?xml version="1.0" encoding="UTF-8"?>
    <bom xmlns="http://cyclonedx.org/schema/bom/1.6"><unexpected/></bom>`
  const brokenXML = `<?xml version="1.0" encoding="UTF-8"?>
    <bom xmlns="http://cyclonedx.org/schema/bom/1.6">` // not closed

  if (makeValidator.fails) {
    test('call should fail/throw', () => {
      assert.rejects(
        async () => {
          await makeValidator(schemaPath)
        },
        (err) => {
          assert.ok(err instanceof Error)
          assert.match(err.message, /no XmlValidator available/i)
          return true
        }
      )
    })
  } else {
    test('valid causes no validationError', async () => {
      const validationError = (await makeValidator(schemaPath))(validXML)
      assert.strictEqual(validationError, null)
    })

    test('invalid causes validationError', async () => {
      const validationError = (await makeValidator(schemaPath))(invalidXML)
      assert.notEqual(validationError, null)
    })

    test('broken causes validationError', async () => {
      const validator = await makeValidator(schemaPath)
      assert.throws(() => { validator(brokenXML) })
    })
  }
})
