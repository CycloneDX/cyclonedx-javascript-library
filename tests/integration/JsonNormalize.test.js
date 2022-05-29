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
