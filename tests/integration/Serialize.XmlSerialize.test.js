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
    XML: { Normalize: { Factory: XmlNormalizeFactory } },
    XmlSerializer, MissingOptionalDependencyError
  },
  Spec,
  Validation
} = require('../../')

const xmlStringify = require('../../dist.node/_optPlug.node/xmlStringify').default

describe('Serialize.XmlSerialize', function () {
  const expectMissingDepError = xmlStringify.fails ?? false

  this.timeout(60000);

  [
    Spec.Spec1dot6,
    Spec.Spec1dot5,
    Spec.Spec1dot4,
    Spec.Spec1dot3,
    Spec.Spec1dot2
  ].forEach(spec => describe(`complex with spec v${spec.version}`, () => {
    const normalizerFactory = new XmlNormalizeFactory(spec)

    beforeEach(function () {
      this.bom = createComplexStructure()
    })

    afterEach(function () {
      delete this.bom
    })

    if (expectMissingDepError) {
      it('throws MissingOptionalDependencyError', function () {
        const serializer = new XmlSerializer(normalizerFactory)
        assert.throws(
          () => { serializer.serialize(this.bom, {}) },
          (err) => err instanceof MissingOptionalDependencyError
        )
      })
      return // skip other tests
    }

    it('serialize', async function () {
      const serializer = new XmlSerializer(normalizerFactory)
      const serialized = await serializer.serialize(
        this.bom, {
          sortLists: true,
          space: 4
        })

      const validator = new Validation.XmlValidator(spec.version)
      try {
        const validationError = await validator.validate(serialized)
        assert.strictEqual(validationError, null)
      } catch (err) {
        if (!(err instanceof Validation.MissingOptionalDependencyError)) {
          // unexpected error
          throw err
        }
      }

      if (process.env.CJL_TEST_UPDATE_SNAPSHOTS) {
        writeSerializeResult(serialized, 'xml_complex', spec.version, 'xml')
      }
      assert.strictEqual(
        serialized,
        loadSerializeResult('xml_complex', spec.version, 'xml'))
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
          return { type: 'element', name: 'dummy' }
        }
      }
      const normalizerFactory = { makeForBom: () => bomNormalizer, spec: Spec.Spec1dot4 }
      const serializer = new XmlSerializer(normalizerFactory)

      try {
        serializer.serialize(bom)
      } catch (err) {
        assert.ok(err instanceof Error)
        assert.match(err.message, /no XmlStringifier available./i)
      }

      assert.strictEqual(normalizedBomRefs.has('testing'), true)
      assert.strictEqual(normalizedBomRefs.size, 4, 'not every value was unique')
      // everything back to before - all have
      knownBomRefs.forEach(({ value }) => assert.strictEqual(value, 'testing'))
    })
  })
})
