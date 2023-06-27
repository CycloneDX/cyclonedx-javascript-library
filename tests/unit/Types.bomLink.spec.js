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
  Types: { isBomLinkDocument, isBomLinkElement, isBomLink }
} = require('../../')

suite('Types.bomLink', () => {
  suite('isBomLinkDocument()', () => {
    test('valid', () => {
      // taken from examples in https://cyclonedx.org/capabilities/bomlink/
      const actual = isBomLinkDocument('urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7/1')
      assert.strictEqual(actual, true)
    })
    test('invalid: is element', () => {
      const actual = isBomLinkDocument('urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7/1#componentA')
      assert.strictEqual(actual, false)
    })
    test('invalid: missing version', () => {
      const actual = isBomLinkDocument('urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7/')
      assert.strictEqual(actual, false)
    })
    test('invalid: prefixed', () => {
      const actual = isBomLinkDocument('see urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7/1')
      assert.strictEqual(actual, false)
    })
    test('invalid: missing leadin', () => {
      const actual = isBomLinkDocument('f08a6ccd-4dce-4759-bd84-c626675d60a7/1')
      assert.strictEqual(actual, false)
    })
  })

  suite('isBomLinkElement()', () => {
    test('valid', () => {
      // taken from examples in https://cyclonedx.org/capabilities/bomlink/
      const actual = isBomLinkElement('urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7/1#componentA')
      assert.strictEqual(actual, true)
    })
    test('invalid: is document', () => {
      const actual = isBomLinkElement('urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7/1')
      assert.strictEqual(actual, false)
    })
    test('invalid: missing element', () => {
      const actual = isBomLinkElement('urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7#')
      assert.strictEqual(actual, false)
    })
    test('invalid: prefixed', () => {
      const actual = isBomLinkElement('see urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7/1#componentA')
      assert.strictEqual(actual, false)
    })
    test('invalid: missing leadin', () => {
      const actual = isBomLinkElement('f08a6ccd-4dce-4759-bd84-c626675d60a7/1#componentA')
      assert.strictEqual(actual, false)
    })
  })

  suite('isBomLink()', () => {
    test('valid document', () => {
      // taken from examples in https://cyclonedx.org/capabilities/bomlink/
      const actual = isBomLink('urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7/1')
      assert.strictEqual(actual, true)
    })
    test('valid element', () => {
      // taken from examples in https://cyclonedx.org/capabilities/bomlink/
      const actual = isBomLink('urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7/1#componentA')
      assert.strictEqual(actual, true)
    })
    test('invalid', () => {
      const actual = isBomLink('')
      assert.strictEqual(actual, false)
    })
  })
})
