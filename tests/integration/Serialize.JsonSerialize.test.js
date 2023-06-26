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
const { loadSerializeResult, writeSerializeResult } = require('../_data/serialize')

const {
  Models, Enums,
  Serialize: {
    JSON: { Normalize: { Factory: JsonNormalizeFactory } },
    JsonSerializer
  },
  Spec: { Spec1dot2, Spec1dot3, Spec1dot4, Spec1dot5 },
  Validation: {
    MissingOptionalDependencyError,
    JsonStrictValidator
  }
} = require('../../')

describe('Serialize.JsonSerialize', function () {
  this.timeout(60000);

  [
    Spec1dot5,
    Spec1dot4,
    Spec1dot3,
    Spec1dot2
  ].forEach(spec => describe(`complex with spec v${spec.version}`, () => {
    const normalizerFactory = new JsonNormalizeFactory(spec)

    beforeEach(function () {
      this.bom = createComplexStructure()
    })

    afterEach(function () {
      delete this.bom
    })

    it('serialize', async function () {
      const serializer = new JsonSerializer(normalizerFactory)

      const serialized = serializer.serialize(
        this.bom, {
          sortLists: true,
          space: 4
        })

      const validator = new JsonStrictValidator(spec.version)
      try {
        const validationError = await validator.validate(serialized)
        assert.strictEqual(validationError, null)
      } catch (err) {
        if (!(err instanceof MissingOptionalDependencyError)) {
          // unexpected error
          assert.fail(err)
        }
      }

      if (process.env.CJL_TEST_UPDATE_SNAPSHOTS) {
        writeSerializeResult(serialized, 'json_complex', spec.version, 'json')
      }
      assert.strictEqual(
        serialized,
        loadSerializeResult('json_complex', spec.version, 'json'))
    })

    // TODO add more tests
  }))

  describe('make bom-refs unique', () => {
    it('as expected', () => {
      const bom = new Models.Bom({
        metadata: new Models.Metadata({
          component: new Models.Component(Enums.ComponentType.Library, 'root', {
            bomRef: 'testing',
            components: new Models.ComponentRepository([
              new Models.Component(Enums.ComponentType.Library, 'c2', {
                bomRef: 'testing'
              })
            ])
          })
        }),
        components: new Models.ComponentRepository([
          new Models.Component(Enums.ComponentType.Library, 'c1', {
            bomRef: 'testing',
            components: new Models.ComponentRepository([
              new Models.Component(Enums.ComponentType.Library, 'c2', {
                bomRef: 'testing'
              })
            ])
          })
        ])
      })
      const knownBomRefs = [
        bom.metadata.component.bomRef,
        [...bom.metadata.component.components][0].bomRef,
        [...bom.components.values()][0].bomRef,
        [...[...bom.components][0].components][0].bomRef
      ]
      const normalizedBomRefs = new Set(/* will be filled on call */)
      const bomNormalizer = {
        normalize: (bom) => {
          normalizedBomRefs.add(bom.metadata.component.bomRef.value)
          normalizedBomRefs.add([...bom.metadata.component.components][0].bomRef.value)
          normalizedBomRefs.add([...bom.components.values()][0].bomRef.value)
          normalizedBomRefs.add([...[...bom.components][0].components][0].bomRef.value)
          return {}
        }
      }
      const normalizerFactory = { makeForBom: () => bomNormalizer, spec: Spec1dot4 }
      const serializer = new JsonSerializer(normalizerFactory)

      serializer.serialize(bom)

      assert.strictEqual(normalizedBomRefs.has('testing'), true)
      assert.strictEqual(normalizedBomRefs.size, 4, 'not every value was unique')
      // everything back to before - all have
      knownBomRefs.forEach(({ value }) => assert.strictEqual(value, 'testing'))
    })
  })
})
