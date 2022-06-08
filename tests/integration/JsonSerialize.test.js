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

const { createComplexStructure } = require('../_data/models')
const { loadSerializeResult } = require('../_data/serialize')
/* uncomment next line to dump data */
// const { writeSerializeResult } = require('../_data/serialize')

const {
  Serialize: {
    JSON: { Normalize: { Factory: JsonNormalizeFactory } },
    JsonSerializer
  },
  Spec: { Spec1dot2, Spec1dot3, Spec1dot4 }
} = require('../../')

describe('JSON serialize', () => {
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

    it('serialize', function () {
      const serializer = new JsonSerializer(normalizerFactory)
      const serialized = serializer.serialize(
        this.bom, {
          sortLists: true,
          space: 4
        })

      /* uncomment next line to dump data */
      // writeSerializeResult(serialized, 'json_complex', spec.version, 'json')

      assert.strictEqual(
        serialized,
        loadSerializeResult('json_complex', spec.version, 'json'))
    })

    // TODO add more tests
  }))
})
