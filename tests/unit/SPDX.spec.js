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

const {
  SPDX: { fixupSpdxId, isSupportedSpdxId }
} = require('../../')

suite('isSupportedSpdxId()', () => {
  const knownSpdxIds = Object.freeze(['MIT', 'Apache-2.0'])

  suite('is true', () =>
    knownSpdxIds.forEach(value =>
      test(`for: ${value}`, () =>
        assert.strictEqual(isSupportedSpdxId(value), true)
      )
    )
  )

  suite('is false', () =>
    [null, undefined, 'fooBarbaz', 'mit'].forEach(value =>
      test(`for: ${value}`, () =>
        assert.strictEqual(isSupportedSpdxId(value), false)
      )
    )
  )
})

suite('fixupSpdxId()', () => {
  const expectedFixed = new Map([
    ['MIT', 'MIT'],
    ['mit', 'MIT'],
    ['Apache-2.0', 'Apache-2.0'],
    ['ApAcHe-2.0', 'Apache-2.0'],
    ['apache-2.0', 'Apache-2.0']
  ])

  suite('transform', () =>
    expectedFixed.forEach((expected, value) =>
      test(`${value} => ${expected}`, () =>
        assert.strictEqual(fixupSpdxId(value), expected)
      )
    )
  )

  suite('miss', () =>
    [undefined, null, 'fooBarbaz'].forEach((value) =>
      test(`${value}`, () =>
        assert.strictEqual(fixupSpdxId(value), undefined)
      )
    )
  )
})
