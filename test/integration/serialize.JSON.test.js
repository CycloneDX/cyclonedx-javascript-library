
const assert = require('assert')
const { describe, beforeEach, afterEach, it } = require('mocha')

const { createComplexStructure, loadSerializeResult } = require('../_data/serialize')
/* uncomment next line to dump data */
// const { writeSerializeResult } = require('../_data/serialize')

const JsonSerialize = require('../../').Serialize.JSON
const { Spec } = require('../../')

describe('JSON serialize', () => {
  [
    Spec.Spec1dot2,
    Spec.Spec1dot3,
    Spec.Spec1dot4
  ].forEach(spec => describe(`complex with spec v${spec.version}`, () => {
    const serializer = new JsonSerialize.Serializer(new JsonSerialize.Normalize.Factory(spec))

    beforeEach(function () {
      this.bom = createComplexStructure()
    })

    afterEach(function () {
      delete this.bom
    })

    it('can serialize', function () {
      const serialized = serializer.serialize(this.bom)

      /* uncomment next line to dump data */
      // writeSerializeResult(serialized, 'complex', spec.version, 'json')

      assert.deepStrictEqual(
        JSON.parse(serialized),
        JSON.parse(loadSerializeResult('complex', spec.version, 'json'))
      )
    })

    it('can serialize with sorted lists', function () {
      const serialized = serializer.serialize(this.bom, { sortLists: true })

      /* uncomment next line to dump data */
      // writeSerializeResult(serialized, 'sortedLists', spec.version, 'json')

      assert.deepStrictEqual(
        JSON.parse(serialized),
        JSON.parse(loadSerializeResult('sortedLists', spec.version, 'json'))
      )
    })

    // TODO add more tests
  }))
})
