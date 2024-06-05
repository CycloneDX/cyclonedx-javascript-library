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
const { suite, test, before } = require('mocha')

const {
  _Resources: Resources,
  Spec: { Version }
} = require('../../../')
const { pathToFileURL } = require('url')
const { realpathSync } = require('fs')
const { join } = require('path')

let makeValidator
try {
  makeValidator = require('../../../dist.node/_optPlug.node/__xmlValidators/libxmljs2').default
} catch {
  makeValidator = undefined
}

before(function () {
  if (typeof makeValidator !== 'function') {
    this.skip()
  }
})

suite('internals: OpPlug.node.xmlValidator :: libxmljs2 ', () => {
  const schemaPath = Resources.FILES.CDX.XML_SCHEMA[Version.v1dot6]
  const validXML = `<?xml version="1.0" encoding="UTF-8"?>
    <bom xmlns="http://cyclonedx.org/schema/bom/1.6"></bom>`
  const invalidXML = `<?xml version="1.0" encoding="UTF-8"?>
    <bom xmlns="http://cyclonedx.org/schema/bom/1.6"><unexpected/></bom>`
  const brokenXML = `<?xml version="1.0" encoding="UTF-8"?>
    <bom xmlns="http://cyclonedx.org/schema/bom/1.6">` // not closed

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

  test('is not affected by XXE injection', async () => {
    // see https://github.com/CycloneDX/cyclonedx-javascript-library/issues/1061
    const xxeFile = join(__dirname, '..', '..', '_data', 'xxe_flag.txt')
    const input = `<?xml version="1.0" encoding="UTF-8"?>
        <!DOCTYPE poc [
          <!ENTITY flag SYSTEM "${pathToFileURL(realpathSync(xxeFile))}">
        ]>
        <bom xmlns="http://cyclonedx.org/schema/bom/1.6">
          <components>
            <component type="library">
              <name>bar</name>
              <version>1.337</version>
              <licenses>
                <license>
                  <id>&flag;</id>
                </license>
              </licenses>
            </component>
          </components>
        </bom>`
    const validationError = (await makeValidator(schemaPath))(input)
    assert.doesNotMatch(
      JSON.stringify(validationError),
      /vaiquia2zoo3Im8ro9zahNg5mohwipouka2xieweed6ahChei3doox2fek3ise0lmohju3loh5oDu7eigh3jaeR2aiph2Voo/,
      'must not leak secrets')
  })
})
