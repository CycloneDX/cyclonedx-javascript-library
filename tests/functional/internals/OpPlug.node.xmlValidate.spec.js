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

const xmlValidate = require('../../../dist.node/_optPlug.node/xmlValidate/').default
const {
  _Resources: Resources,
  Spec: { Version }
} = require('../../../')

suite('internals: OpPlug.node.xmlValidate::auto', () => {
  const schemaPath = Resources.FILES.CDX.XML_SCHEMA[Version.v1dot6]
  const validXML = '<bom xmlns="http://cyclonedx.org/schema/bom/1.6"></bom>'
  const invalidXML = '<bom> xmlns="http://cyclonedx.org/schema/bom/1.6"><unexpected/></bom>'

  if (xmlValidate.fails) {
    test('call should fail/throw', () => {
      assert.throws(
        () => {
          xmlValidate(validXML, schemaPath, {})
        },
        (err) => {
          assert.ok(err instanceof Error)
          assert.match(err.message, /no XmlValidator available/i)
          return true
        }
      )
    })
  } else {
    test('call should return null', () => {
      const validationError = xmlValidate(validXML, schemaPath, {})
      assert.strictEqual(validationError, null)
    })
    test('call should return validationError', () => {
      const validationError = xmlValidate(invalidXML, schemaPath, {})
      assert.notEqual(validationError, null)
    })
  }
})
