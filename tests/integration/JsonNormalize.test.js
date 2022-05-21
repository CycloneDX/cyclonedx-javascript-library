const assert = require('assert')
const { describe, beforeEach, afterEach, it } = require('mocha')

const { createComplexStructure, loadSerializeResult } = require('../_data/serialize')
/* uncomment next line to dump data */
// const { writeSerializeResult } = require('../_data/serialize')

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
    const normalizerFactopry = new JsonNormalizeFactory(spec)

    beforeEach(function () {
      this.bom = createComplexStructure()
    })

    afterEach(function () {
      delete this.bom
    })

    it('can normalize', function () {
      const normalized = normalizerFactopry.makeForBom()
        .normalize(this.bom, {})
      const json = JSON.stringify(normalized)

      /* uncomment next line to dump data */
      // writeSerializeResult(json, 'complex', spec.version, 'json')

      assert.deepStrictEqual(
        JSON.parse(json),
        JSON.parse(loadSerializeResult('complex', spec.version, 'json'))
      )
    })

    it('can normalize with sorted lists', function () {
      const normalized = normalizerFactopry.makeForBom()
        .normalize(this.bom, { sortLists: true })
      const json = JSON.stringify(normalized)

      /* uncomment next line to dump data */
      // writeSerializeResult(json, 'sortedLists', spec.version, 'json')

      assert.deepStrictEqual(
        JSON.parse(json),
        JSON.parse(loadSerializeResult('sortedLists', spec.version, 'json'))
      )
    })

    // TODO add more tests
  }))
})
