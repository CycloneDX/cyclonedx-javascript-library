const assert = require('assert')
const { suite, test } = require('mocha')

const { getSpecEnum } = require('../_data/specLoader')
const { capitaliseFirstLetter } = require('../_helpers/stringFunctions')

const {
  Enums: { HashAlgorithm },
  Spec: { Version, SpecVersionDict }
} = require('../../')

suite('HashAlgorithm enum', () => {
  const schemas = new Map([
    [Version.v1dot2, 'bom-1.2.SNAPSHOT.schema.json'],
    [Version.v1dot3, 'bom-1.3.SNAPSHOT.schema.json'],
    [Version.v1dot4, 'bom-1.4.SNAPSHOT.schema.json']
  ])

  schemas.forEach((resourceFile, specVersion) =>
    suite(`from spec ${specVersion} (${resourceFile})`, () =>
      getSpecEnum(resourceFile, 'hash-alg').forEach(enumValue => {
        const expectedName = capitaliseFirstLetter(enumValue)
        test(`is known: ${expectedName} -> ${enumValue}`, () =>
          assert.strictEqual(HashAlgorithm[expectedName], enumValue)
        )
        test(`is supported: ${enumValue}`, () =>
          assert.ok(SpecVersionDict[specVersion]?.supportsHashAlgorithm(enumValue))
        )
      })
    )
  )
})
