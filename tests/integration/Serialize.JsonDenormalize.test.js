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
    JSON: {
      Denormalize: { Factory: JsonDenormalizeFactory },
      Normalize: { Factory: JsonNormalizeFactory }
    }
  },
  Spec: { Spec1dot2, Spec1dot3, Spec1dot4 }
} = require('../../')

describe('Serialize.JsonDenormalize', function () {
  this.timeout(60000)
  it('fail without warningFunc1', function () {
    const denormalizerFactory = new JsonDenormalizeFactory()
    assert.throws(() => denormalizerFactory.makeForBom().denormalize({
      bomFormat: 'CycloneDX',
      specVersion: '1.2',
      metadata: {
        timestamp: 12345
      }
    }, { options: {} }, []), new TypeError('.metadata.timestamp is number but should be one of [string, undefined]'))
  })

  it('fail without warningFunc2', function () {
    const denormalizerFactory = new JsonDenormalizeFactory()
    assert.throws(() => denormalizerFactory.makeForBom().denormalize({
      bomFormat: 'CycloneDX',
      specVersion: '1.2',
      metadata: {
        tools: 'many'
      }
    }, { options: {} }, []), new TypeError('.metadata.tools is string but should be one of [_array, undefined]'))
  })

  it('call warningFunc', function () {
    const denormalizerFactory = new JsonDenormalizeFactory()
    let warningFuncCalled = 0
    denormalizerFactory.makeForBom().denormalize({
      bomFormat: 'CycloneDX',
      specVersion: '1.2',
      metadata: {
        timestamp: 12345,
        tools: [
          123,
          {
            vendor: 'tool vendor',
            name: 'tool name',
            hashes: {},
            externalReferences: [
              {
                url: 'https://cyclonedx.org/tool-center/',
                type: 'website',
                comment: 123
              }
            ]
          }
        ]
      }
    }, {
      options: {
        warningFunc: (w) => {
          warningFuncCalled++
        }
      }
    }, [])
    assert.strictEqual(warningFuncCalled, 3)
  })

  const specs = [Spec1dot2, Spec1dot3, Spec1dot4]
  for (const spec of specs) {
    describe(`complex with spec v${spec.version}`, () => {
      const denormalizerFactory = new JsonDenormalizeFactory(spec)
      const normalizerFactory = new JsonNormalizeFactory(spec)

      beforeEach(function () {
        this.bom = createComplexStructure(false)
      })

      afterEach(function () {
        delete this.bom
      })

      it('can denormalize with correct result', function () {
        const normalized = JSON.parse(loadNormalizeResult('json_sortedLists', spec.version, 'json'))
        const denormalizedBom = denormalizerFactory.makeForBom()
          .denormalize(normalized, { }, [])
        const normalizedAgain = normalizerFactory.makeForBom().normalize(denormalizedBom, { sortLists: true })
        assert.deepStrictEqual(
          JSON.stringify(normalized, null, 2),
          JSON.stringify(normalizedAgain, null, 2)
        )
      })
    })
  }
})
