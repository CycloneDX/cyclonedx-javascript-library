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
  Models: { BomLinkDocument, BomLinkElement }
} = require('../../')

suite('unit: Models.BomLinkDocument', () => {
  suite('isValid()', () => {
    test('pass', () => {
      // taken from examples in https://cyclonedx.org/capabilities/bomlink/
      const value = 'urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7/1'
      assert.strictEqual(BomLinkDocument.isValid(value), true)
      assert.doesNotThrow(() => new BomLinkDocument(value))
    })
    test('fail: is element', () => {
      const value = 'urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7/1#componentA'
      assert.strictEqual(BomLinkDocument.isValid(value), false)
      assert.throws(() => new BomLinkDocument(value))
    })
    test('fail: missing version', () => {
      const value = 'urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7/'
      assert.strictEqual(BomLinkDocument.isValid(value), false)
      assert.throws(() => new BomLinkDocument(value))
    })
    test('fail: prefixed', () => {
      const value = 'see urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7/1'
      assert.strictEqual(BomLinkDocument.isValid(value), false)
      assert.throws(() => new BomLinkDocument(value))
    })
    test('fail: missing leadin', () => {
      const value = 'f08a6ccd-4dce-4759-bd84-c626675d60a7/1'
      assert.strictEqual(BomLinkDocument.isValid(value), false)
      assert.throws(() => new BomLinkDocument(value))
    })
  })

  suite('BomLinkElement()', () => {
    test('pass', () => {
      // taken from examples in https://cyclonedx.org/capabilities/bomlink/
      const value = 'urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7/1#componentA'
      assert.strictEqual(BomLinkElement.isValid(value), true)
      assert.doesNotThrow(() => new BomLinkElement(value))
    })
    test('fail: is document', () => {
      const value = 'urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7/1'
      assert.strictEqual(BomLinkElement.isValid(value), false)
      assert.throws(() => new BomLinkElement(value))
    })
    test('fail: missing element', () => {
      const value = 'urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7#'
      assert.strictEqual(BomLinkElement.isValid(value), false)
      assert.throws(() => new BomLinkElement(value))
    })
    test('fail: prefixed', () => {
      const value = 'see urn:cdx:f08a6ccd-4dce-4759-bd84-c626675d60a7/1#componentA'
      assert.strictEqual(BomLinkElement.isValid(value), false)
      assert.throws(() => new BomLinkElement(value))
    })
    test('fail: missing leadin', () => {
      const value = 'f08a6ccd-4dce-4759-bd84-c626675d60a7/1#componentA'
      assert.strictEqual(BomLinkElement.isValid(value), false)
      assert.throws(() => new BomLinkElement(value))
    })
  })
})
