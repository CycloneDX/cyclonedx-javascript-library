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
  normalizedString,
  token
} = require('../../dist.node/serialize/xml/_xsd.js')

suite('unit: Serialize.XML._xsd', () => {
  const normalizedStringCases = {
    '': '',
    '123': '123',
    ' 0 1\r\n2\t3\n4\t': ' 0 1 2 3 4 ',
    ' 0  1\r\n 2 \t3 \n 4 \t': ' 0  1  2  3   4  ',
  }

  const tokenCases = {
    '': '',
    '123': '123',
    ' 0  1 \r\n2\t 3 \n4\n ': '0 1 2 3 4',
    ' 0  1\r\n 2 \t3 \n 4 \t ': '0 1 2 3 4',
  }

  /**
   * @param {string} s
   * @return {string}
   */
  function escapeTNR(s) {
    return s
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
  }

  suite('normalizedString()', () => {
    for (const [input, expected] of Object.entries(normalizedStringCases)) {
      test(`i: "${escapeTNR(input)}"`, () => {
        assert.strictEqual(normalizedString(input), expected)
      })
    }
  })
  suite('token()', () => {
    for (const [input, expected] of Object.entries(tokenCases)) {
      test(`i: "${escapeTNR(input)}"`, () => {
        assert.strictEqual(token(input), expected)
      })
    }
  })
})
