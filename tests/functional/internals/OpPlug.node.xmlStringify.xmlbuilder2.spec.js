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

let xmlStringify
try {
  xmlStringify = require('../../../dist.node/_optPlug.node/xmlStringify/__opts/xmlbuilder2').default
} catch {
  xmlStringify = undefined
}

(xmlStringify === undefined
  ? suite.skip
  : suite
)('internals: OpPlug.node.xmlStringify :: xmlbuilder2', () => {
  const data = {
    type: 'element',
    name: 'some-children',
    children: [
      {
        type: 'element',
        name: 'some-attributes',
        attributes: {
          string: 'some-value',
          number: 1,
          'quote-encode': 'foo " bar'
        }
      },
      {
        type: 'element',
        name: 'some-text',
        children: 'testing... \n' +
            'amp-encode? & \n' +
            'tag-encode? <b>foo<b> \n'
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
      },
      {
        type: 'not-an-element',
        namespace: 'https://example.com/ns1',
        name: 'not-element',
        children: 'omit this thing, it is not an element.'
      }
    ]
  }

  test('data w/o spacing', () => {
    const stringified = xmlStringify(data)
    assert.strictEqual(stringified,
      '<?xml version="1.0" encoding="UTF-8"?>' +
        '<some-children>' +
        '<some-attributes string="some-value" number="1" quote-encode="foo &quot; bar"/>' +
        '<some-text>testing... \n' +
        'amp-encode? &amp; \n' +
        'tag-encode? &lt;b&gt;foo&lt;b&gt; \n' +
        '</some-text>' +
        '<some-namespaced xmlns="https://example.com/ns1">' +
        '<empty/>' +
        '</some-namespaced>' +
        '</some-children>'
    )
  })

  test('data with space=4', () => {
    const stringified = xmlStringify(data, { space: 4 })
    assert.strictEqual(stringified,
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<some-children>\n' +
        '    <some-attributes string="some-value" number="1" quote-encode="foo &quot; bar"/>\n' +
        '    <some-text>testing... \n' +
        'amp-encode? &amp; \n' +
        'tag-encode? &lt;b&gt;foo&lt;b&gt; \n' +
        '</some-text>\n' +
        '    <some-namespaced xmlns="https://example.com/ns1">\n' +
        '        <empty/>\n' +
        '    </some-namespaced>\n' +
        '</some-children>'
    )
  })

  test('data with space=TAB', () => {
    const stringified = xmlStringify(data, { space: '\t' })
    assert.strictEqual(stringified,
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<some-children>\n' +
        '\t<some-attributes string="some-value" number="1" quote-encode="foo &quot; bar"/>\n' +
        '\t<some-text>testing... \n' +
        'amp-encode? &amp; \n' +
        'tag-encode? &lt;b&gt;foo&lt;b&gt; \n' +
        '</some-text>\n' +
        '\t<some-namespaced xmlns="https://example.com/ns1">\n' +
        '\t\t<empty/>\n' +
        '\t</some-namespaced>\n' +
        '</some-children>')
  })
})
