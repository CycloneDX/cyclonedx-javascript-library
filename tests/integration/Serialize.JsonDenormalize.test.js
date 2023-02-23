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

const { createComplexStructure } = require('../_data/models')
const { loadNormalizeResult } = require('../_data/normalize')

const {
  Serialize: {
    JSON: { Denormalize: { Factory: JsonDenormalizeFactory } }
  },
  Spec: { Spec1dot2, Spec1dot3, Spec1dot4 }
} = require('../../')

describe('Serialize.JsonDenormalize', function () {
  this.timeout(60000);

  [
    Spec1dot2,
    Spec1dot3,
    Spec1dot4
  ].forEach(spec => describe(`complex with spec v${spec.version}`, () => {
    const denormalizerFactory = new JsonDenormalizeFactory(spec)

    beforeEach(function () {
      this.bom = createComplexStructure(false)
    })

    afterEach(function () {
      delete this.bom
    })

    it('can denormalize with correct result', function () {
      const normalized = JSON.parse(loadNormalizeResult('json_sortedLists', spec.version, 'json'))
      const denormalizedBom = denormalizerFactory.makeForBom()
        .denormalize(normalized, { sortLists: true })

      assert.deepStrictEqual(
        denormalizedBom,
        this.bom
      )
    })

    // TODO add more tests
  }))
})
