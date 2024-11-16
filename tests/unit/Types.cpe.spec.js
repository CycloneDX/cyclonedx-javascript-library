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
  Types: { isCPE }
} = require('../../')

suite('unit: Types.cpe', () => {
  suite('isCPE()', () => {
    test('2.2', () => {
      const actual = isCPE('cpe:/a:microsoft:internet_explorer:11:-')
      assert.strictEqual(actual, true)
    })
    test('2.3', () => {
      const actual = isCPE('cpe:2.3:a:adobe:flash_player:19.0.0.245:*:*:*:*:internet_explorer:*:*')
      assert.strictEqual(actual, true)
    })
    test('reverted XML special-chars', () => {
      // pattern is taken from XML.
      // XML encodes some chars - like '"` -> `&quot;` or `&` -> `&amp;`.
      // this encoding must have been reverted for the RegularExpression.
      // use case: test if the CPE-escaped(`\`) chars are working as expected
      const actual = isCPE('cpe:2.3:a:acme:foobarbaz:1.3.3.7:*:*:*:\\":\\&:\\>:\\<')
      assert.strictEqual(actual, true)
    })
  })
})
