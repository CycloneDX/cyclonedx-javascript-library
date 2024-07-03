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

suite('Serialize.XML._xsd', () => {
  const normalizedStringCases = {
    '': '',
    ' \r\n \t \n ': '        ',
    ' f o  o ': ' f o  o ',
    '1 2 3': '1 2 3',
    '1\r\n2\t3\n': '1  2 3 ',
    '1&#xd;&#xa;2&#x9;3&#xa;': '1  2 3 ',
    '1&#x0d;&#x00a;2&#x0009;3&#xa;': '1  2 3 ',
    '1&#xD;&#xA;2&#x9;3&#xA;': '1  2 3 ',
    '1&#x0D;&#x00A;2&#x0009;3&#xA;': '1  2 3 ',
    '1&#13;&#10;2&#9;3&#10;': '1  2 3 ',
    '1&#013;&#0010;2&#0009;3&#10;': '1  2 3 ',
  }

  const tokenCases = {
    '': '',
    ' \r\n \t \n ': '',
    ' f o  o\r\n ': 'f o o',
    '1 2 3': '1 2 3',
    '1 \r\n2\t 3 \n': '1 2 3',
    '1&#xd;&#xa;2&#x9;3&#xa; ': '1 2 3',
    '1 &#x0d;&#x00a;\n2&#x0009;3&#xa;': '1 2 3',
    '1&#xD;&#xA;2&#x9;3&#xA;': '1 2 3',
    '1&#x0D;&#x00A;\t2&#x0009; 3&#xA;': '1 2 3',
    ' 1&#13;&#10;2&#9;3\r&#10;': '1 2 3',
    '1\t&#0013;&#0010;\n2&#0009;3&#10;': '1 2 3',
  }

  suite('normalizedString', () => {
    for (const [input, expected] of Object.entries(normalizedStringCases)) {
      test(`i: ${input}`, () => {
        assert.strictEqual(normalizedString(input), expected)
      })
    }
  })
  suite('token', () => {
    for (const [input, expected] of Object.entries(tokenCases)) {
      test(`i: ${input}`, () => {
        assert.strictEqual(token(input), expected)
      })
    }
  })
})
