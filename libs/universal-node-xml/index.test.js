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

const { stringify } = require('./')

suite('stringify', () => {
  assert.strictEqual(typeof stringify, 'function')

  const dummyElem = Object.freeze({
    type: 'element',
    name: 'foo'
  })

  if (stringify.fails) {
    test('call should fail/throw', () => {
      assert.throws(
        () => {
          stringify(dummyElem)
        },
        (err) => {
          assert.ok(err instanceof Error)
          assert.match(err.message, /no stringifier available/i)
          return true
        }
      )
    })
  } else {
    test('call should pass', () => {
      const stringified = stringify(dummyElem)
      assert.match(stringified, /<foo(:?\/>|><\/foo>)/)
    })
  }

})
