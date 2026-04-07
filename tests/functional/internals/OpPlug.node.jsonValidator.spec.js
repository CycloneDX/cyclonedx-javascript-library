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
  _Resources: Resources,
  Spec: { Version }
} = require('../../../')
const { OptPlugError } = require('../../../dist.node/_optPlug.node/errors')
const { default: makeValidator } = require('../../../dist.node/_optPlug.node/jsonValidator')

suite('functional: internals: OpPlug.node.jsonValidator auto', () => {
  if (makeValidator.fails) {
    test('call should fail/throw', () => {
      assert.throws(
        () => { makeValidator() },
        (err) => {
          assert.ok(err instanceof OptPlugError)
          assert.match(err.message, /no JsonValidator available/i)
          return true
        }
      )
    })
    return
  }

  const schemaPath = Resources.FILES.CDX.JSON_SCHEMA[Version.v1dot7]
  const schemaMap = {
    'http://cyclonedx.org/schema/spdx.SNAPSHOT.schema.json': Resources.FILES.SPDX.JSON_SCHEMA,
    'http://cyclonedx.org/schema/cryptography-defs.SNAPSHOT.schema.json': Resources.FILES.CryptoDefs.JSON_SCHEMA,
    'http://cyclonedx.org/schema/jsf-0.82.SNAPSHOT.schema.json': Resources.FILES.JSF.JSON_SCHEMA
  }
  const validJson = '{"bomFormat": "CycloneDX", "specVersion": "1.7"}'
  const invalidJson = '{"bomFormat": "unexpected", "specVersion": "1.7"}'
  const brokenJson = '{"bomFormat": "CycloneDX", "specVersion": "1.7"' // not closed

  test('valid causes no validationError', async () => {
    const validationError = (await makeValidator(schemaPath, schemaMap))(validJson)
    assert.strictEqual(validationError, null)
  })

  test('invalid causes validationError', async () => {
    const validationError = (await makeValidator(schemaPath, schemaMap))(invalidJson)
    assert.notEqual(validationError, null)
  })

  test('broken causes validationError', async () => {
    const validator = await makeValidator(schemaPath, schemaMap)
    assert.throws(() => { validator(brokenJson) })
  })

  // list of valid/invalid emails is from https://github.com/json-schema-org/JSON-Schema-Test-Suite
  // (tests/draft2019-09/optional/format/email.json and idn-email.json)
  // and https://github.com/luzlab/ajv-formats-draft2019 (index.test.js)

  suite('accepts valid emails', () =>
    [
      'joe.bloggs@example.com',
      'te~st@example.com',
      '~test@example.com',
      'test~@example.com',
      'te.s.t@example.com',
      '실례@실례.테스트',
      'квіточка@пошта.укр',
      'Dörte@Sörensen.example.com'
    ].forEach(validEmail => test(validEmail, async () => {
      const validator = await makeValidator(schemaPath, schemaMap)
      const validJson = JSON.stringify({
        bomFormat: 'CycloneDX',
        specVersion: '1.7',
        metadata: { authors: [{ email: validEmail }] }
      })
      assert.strictEqual(validator(validJson), null)
    }))
  )

  suite('rejects invalid emails', () =>
    [
      '2962',
      '.test@example.com',
      'test.@example.com',
      'te..st@example.com',
      '',
      'johndoe',
      'valid@example.com?asdf'
    ].forEach(invalidEmail => test(invalidEmail, async () => {
      const validator = await makeValidator(schemaPath, schemaMap)
      const invalidJson = JSON.stringify({
        bomFormat: 'CycloneDX',
        specVersion: '1.7',
        metadata: { authors: [{ email: invalidEmail }] }
      })
      assert.notEqual(validator(invalidJson), null)
    }))
  )
})
