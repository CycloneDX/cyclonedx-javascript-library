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

const { getSpecElement, getSpecEnum, loadSpec } = require('./specLoader')

suite('test helpers: specLoader', () => {
  const expectedDefinitionsAffectedStatusEnum = [
    'affected',
    'unaffected',
    'unknown'
  ]

  suite('loadSpec()', () => {
    test('unknown file', () => {
      assert.throws(
        () => { loadSpec('DOES-NOT-EXIST.schema.json') },
        Error,
        'missing expected error'
      )
    })
    test('happy path', () => {
      const loaded = loadSpec('bom-1.4.SNAPSHOT.schema.json')
      // dummy test to see if loading worked somehow ...
      assert.deepStrictEqual(loaded.definitions.affectedStatus.enum, expectedDefinitionsAffectedStatusEnum)
    })
  })

  suite('getSpecElement()', () => {
    test('unknown path', () => {
      assert.throws(
        () => { getSpecElement('bom-1.4.SNAPSHOT.schema.json', 'properties', 'UNKNOWN_PROP') },
        TypeError('undefined element: bom-1.4.SNAPSHOT.schema.json#properties.UNKNOWN_PROP'),
        'missing expected error'
      )
    })
    test('happy path', () => {
      const loaded = getSpecElement(
        'bom-1.4.SNAPSHOT.schema.json',
        'definitions', 'affectedStatus', 'enum')
      // dummy test to see if loading worked somehow ...
      assert.deepStrictEqual(loaded, expectedDefinitionsAffectedStatusEnum)
    })
  })

  suite('getSpecEnum()', () => {
    test('happy path', () => {
      const loaded = getSpecEnum(
        'bom-1.4.SNAPSHOT.schema.json',
        'affectedStatus')
      // dummy test to see if loading worked somehow ...
      assert.deepStrictEqual(loaded, expectedDefinitionsAffectedStatusEnum)
    })
  })
})
