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
  Enums: {
    HashAlgorithm
  },
  Utils: {
    NpmjsUtility
  }
} = require('../../')

suite('unit: Utils.NpmjsUtility.defaultRegistryMatcher', () => {
  test('matches pure domain', () => {
    const actual = NpmjsUtility.defaultRegistryMatcher.test('https://registry.npmjs.org')
    assert.strictEqual(actual, true)
  })
  test('matches with path', () => {
    const actual = NpmjsUtility.defaultRegistryMatcher.test('https://registry.npmjs.org/foo/bar')
    assert.strictEqual(actual, true)
  })
  suite('not match unexpected', () => {
    for (const c of [
      'https://my-own=registry.local',
      'https://registry.npmjs.org.uk',
      'https://registry.npmjs.org.uk/foo/bar'
    ]) {
      test(c, () => {
        const actual = NpmjsUtility.defaultRegistryMatcher.test(c)
        assert.strictEqual(actual, false)
      })
    }
  })
})

suite('unit: Utils.NpmjsUtility.parsePackageIntegrity', () => {
  suite('as expected', () => {
    for (const [c, ...expected] of [
      ['sha512-zvj65TkFeIt3i6aj5bIvJDzjjQQGs4o/sNoezg1F1kYap9Nu2jcUdpwzRSJTHMMzG0H7bZkn4rNQpImhuxWX2A==',
        HashAlgorithm['SHA-512'],
        'cef8fae53905788b778ba6a3e5b22f243ce38d0406b38a3fb0da1ece0d45d6461aa7d36eda3714769c334522531cc3331b41fb6d9927e2b350a489a1bb1597d8'
      ],
      ['sha1-Kq5sNclPz7QV2+lfQIuc6R7oRu0=',
        HashAlgorithm['SHA-1'],
        '2aae6c35c94fcfb415dbe95f408b9ce91ee846ed'
      ],
      ['sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
        HashAlgorithm['SHA-256'],
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      ],
      ['sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC',
        HashAlgorithm['SHA-384'],
        'a2a56e01f5d129aa7b7dd81c098e6eca433af91f46a90f0afeec72f6bc7b1cd42519897590fcd0868d70c7827063cc02'
      ],
    ]) {
      test(c, () => {
        const actual = NpmjsUtility.parsePackageIntegrity(c)
        assert.deepStrictEqual(actual, expected)
      })
    }
  })
  suite('fails', () => {
    for (const c of [
      'sha1-Kq5sNclPz7QV2+lfQIuc6R7oRu0', // missing character
      'sha1-Kq5sNclPz7QV2+lfQIuc6R7oRu0==', // additional character
      'sha512-Kq5sNclPz7QV2+lfQIuc6R7oRu0=', // alg and hash dont match
    ]) {
      test(c, () => {
        assert.throws(() => {
          NpmjsUtility.parsePackageIntegrity(c)
        })
      })
    }
  })
})
