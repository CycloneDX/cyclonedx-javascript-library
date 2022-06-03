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
const { describe, beforeEach, afterEach, it } = require('mocha')

const { createComplexStructure, loadNormalizeResult } = require('../_data/normalize')
/* uncomment next line to dump data */
// const { writeNormalizeResult } = require('../_data/normalize')

const {
  Serialize: {
    JSON: { Normalize: { Factory: JsonNormalizeFactory } }
  },
  Spec: { Spec1dot2, Spec1dot3, Spec1dot4 }
} = require('../../')

describe('JSON normalize', () => {
  [
    Spec1dot2,
    Spec1dot3,
    Spec1dot4
  ].forEach(spec => describe(`complex with spec v${spec.version}`, () => {
    const normalizerFactory = new JsonNormalizeFactory(spec)

    beforeEach(function () {
      this.bom = createComplexStructure()
    })

    afterEach(function () {
      delete this.bom
    })

    it('can normalize', function () {
      const normalized = normalizerFactory.makeForBom()
        .normalize(this.bom, {})

      const json = JSON.stringify(normalized, null, 2)
      /* uncomment next line to dump data */
      // writeNormalizeResult(json, 'json_complex', spec.version, 'json')
      assert.deepStrictEqual(
        JSON.parse(json),
        JSON.parse(loadNormalizeResult('json_complex', spec.version, 'json'))
      )
    })

    it('can normalize with sorted lists', function () {
      const normalized = normalizerFactory.makeForBom()
        .normalize(this.bom, { sortLists: true })

      const json = JSON.stringify(normalized, null, 2)
      /* uncomment next line to dump data */
      // writeNormalizeResult(json, 'json_sortedLists', spec.version, 'json')
      assert.deepStrictEqual(
        JSON.parse(json),
        JSON.parse(loadNormalizeResult('json_sortedLists', spec.version, 'json'))
      )
    })

    // TODO add more tests
  }))
})
