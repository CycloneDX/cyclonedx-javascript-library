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

const {
  Serialize: {
    JsonSerializer,
    JSON: { Normalize: { Factory } }
  },
  Spec: { Format, Spec1dot4, UnsupportedFormatError }
} = require('../../')

suite('unit: Serialize.JsonSerializer', () => {
  suite('constructor', () => {
    test('happy path', () => {
      const normalizerFactory = new Factory(Spec1dot4)
      const actual = new JsonSerializer(normalizerFactory)
      assert.strictEqual(actual.normalizerFactory, normalizerFactory)
    })
    test('throws if JSON unsupported by spec', () => {
      const normalizerFactoryDummy = { spec: { supportsFormat: f => f !== Format.JSON } }
      assert.throws(
        () => {
          /* eslint-disable-next-line no-new -- needed to test constructor */
          new JsonSerializer(normalizerFactoryDummy)
        },
        UnsupportedFormatError,
        'missing expected error'
      )
    })
  })
})
