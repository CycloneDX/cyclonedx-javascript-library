const assert = require('assert')
const { suite, test } = require('mocha')

const { getSpecEnum } = require('../_data/specLoader')
const { capitaliseFirstLetter } = require('../_helpers/stringFunctions')

const {
  Enums: { HashAlgorithm }
} = require('../../')

suite('all HashAlgorithms from SPEC are available', () => {
  const schemas = new Map([
    ['1.2', 'bom-1.2.SNAPSHOT.schema.json'],
    ['1.3', 'bom-1.3.SNAPSHOT.schema.json'],
    ['1.4', 'bom-1.4.SNAPSHOT.schema.json']
  ])

  schemas.forEach((resourceFile, specVersion) =>
    suite(`from spec ${specVersion}`, () =>
      getSpecEnum(resourceFile, 'hash-alg').forEach(enumValue => {
        const expectedName = capitaliseFirstLetter(enumValue)
        test(`${expectedName} -> ${enumValue}`, () =>
          assert.strictEqual(HashAlgorithm[expectedName], enumValue)
        )
      })
    )
  )
})
