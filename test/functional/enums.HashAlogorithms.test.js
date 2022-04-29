const assert = require('assert')
const { suite, test } = require('mocha')

const enumLoader = require('../_data/enumLoader')

const { HashAlgorithm } = require('../../').Enums

suite('all values from SPEC are available', () => {
  const schemas = new Map([
    ['1.2', 'bom-1.2.SNAPSHOT.schema.json'],
    ['1.3', 'bom-1.3.SNAPSHOT.schema.json'],
    ['1.4', 'bom-1.4.SNAPSHOT.schema.json']
  ])

  schemas.forEach((resourceFile, specVersion) =>
    suite(`from spec ${specVersion}`, () =>
      enumLoader(resourceFile, 'hash-alg').forEach(expected =>
        test(`${expected}`, () =>
          assert.strictEqual(HashAlgorithm[expected], expected)
        )
      )
    )
  )
})
