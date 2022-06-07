'use strict'
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

const stringify = require('./xmlbuilder2')

suite('stringify with xmlbuilder2', () => {
  assert.strictEqual(typeof stringify, 'function')

  const data = {
    type: 'element',
    name: 'some-children',
    children: [
      {
        type: 'element',
        name: 'some-attributes',
        attributes: {
          foo: 'some-value',
          bar: 1
        }
      },
      {
        type: 'element',
        name: 'some-text',
        children: 'This is my texT'
      },
      {
        type: 'element',
        namespace: 'https://example.com/ns1',
        name: 'some-namespaced',
        children: [
          {
            type: 'element',
            name: 'empty'
          }
        ]
      }
    ]
  }

  test('data w/o spacing', () => {
    const stringified = stringify(data)
    assert.strictEqual(stringified,
      '<?xml version="1.0"?>' +
      '<some-children>' +
      '<some-attributes foo="some-value" bar="1"/>' +
      '<some-text>This is my texT</some-text>' +
      '<some-namespaced xmlns="https://example.com/ns1">' +
      '<empty/>' +
      '</some-namespaced>' +
      '</some-children>'
    )
  })

  test('data with space=4', () => {
    const stringified = stringify(data, { space: 4 })
    assert.strictEqual(stringified,
      '<?xml version="1.0"?>\n' +
      '<some-children>\n' +
      '    <some-attributes foo="some-value" bar="1"/>\n' +
      '    <some-text>This is my texT</some-text>\n' +
      '    <some-namespaced xmlns="https://example.com/ns1">\n' +
      '        <empty/>\n' +
      '    </some-namespaced>\n' +
      '</some-children>'
    )
  })

  test('data with space=TAB', () => {
    const stringified = stringify(data, { space: '\t' })
    assert.strictEqual(stringified,
      '<?xml version="1.0"?>\n' +
      '<some-children>\n' +
      '\t<some-attributes foo="some-value" bar="1"/>\n' +
      '\t<some-text>This is my texT</some-text>\n' +
      '\t<some-namespaced xmlns="https://example.com/ns1">\n' +
      '\t\t<empty/>\n' +
      '\t</some-namespaced>\n' +
      '</some-children>')
  })
})
