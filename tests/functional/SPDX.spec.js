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

const { spdxSpecEnum } = require('../_data/spdx')

const { SPDX } = require('../../')

suite('isSupportedSpdxId()', () => {
  /** @type {string[]} knownSpdxIds */
  const knownSpdxIds = Object.freeze([
    ...spdxSpecEnum
  ])

  suite('knows', () => {
    knownSpdxIds.forEach(value =>
      test(`${value}`, () =>
        assert.strictEqual(SPDX.isSupportedSpdxId(value), true)
      )
    )
  })
})

suite('fixupSpdxId()', () => {
  const expectedFixed = new Map([
    ...spdxSpecEnum.map(v => [v, v]),
    ...spdxSpecEnum.map(v => [v.toLowerCase(), v]),
    ...spdxSpecEnum.map(v => [v.toUpperCase(), v])
  ])

  suite('transform', () => {
    expectedFixed.forEach((expected, value) =>
      test(`${value} -> ${expected}`, () =>
        assert.strictEqual(SPDX.fixupSpdxId(value), expected)
      )
    )
  })
})
