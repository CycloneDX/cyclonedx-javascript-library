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
  Utils: {
    NpmjsUtility
  }
} = require('../../')

suite('unit: Utils.NpmjsUtility', () => {
  suite('defaultRegistryMatcher', () => {
    test('matches pure domain', () => {
      const match = NpmjsUtility.defaultRegistryMatcher.test('https://registry.npmjs.org')
      assert.strictEqual(match, true)
    })
    test('matches with path', () => {
      const match = NpmjsUtility.defaultRegistryMatcher.test('https://registry.npmjs.org/foo/bar')
      assert.strictEqual(match, true)
    })
    suite('not match unexpected', () => {
      for (const c in [
        'https://my-own=registry.local',
        'https://registry.npmjs.org.uk',
        'https://registry.npmjs.org.uk/foo/bar'
      ]) {
        test(c, () => {
          const match = NpmjsUtility.defaultRegistryMatcher.test(c)
          assert.strictEqual(match, false)
        })
      }
    })
  })

  suite('parsePackageIntegrity', () => {

  })
})
