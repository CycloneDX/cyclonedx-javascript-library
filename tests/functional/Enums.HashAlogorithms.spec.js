const assert = require('node:assert')
const { suite, test } = require('mocha')

const { getSpecEnum } = require('../_data/specLoader')

const {
  Enums: { HashAlgorithm }
} = require('../../')
const { capitaliseFirstLetter } = require('../_helpers/stringFunctions')

suite('all HashAlgorithms from SPEC are available', () => {
  const schemas = new Map([
    ['1.2', 'bom-1.2.SNAPSHOT.schema.json'],
    ['1.3', 'bom-1.3.SNAPSHOT.schema.json'],
    ['1.4', 'bom-1.4.SNAPSHOT.schema.json']
  ])

  schemas.forEach((resourceFile, specVersion) =>
    suite(`from spec ${specVersion}`, () =>
      getSpecEnum(resourceFile, 'hash-alg').forEach(expected =>
        test(`${expected}`, () =>
          assert.strictEqual(HashAlgorithm[capitaliseFirstLetter(expected)], expected)
        )
      )
    )
  )
})
