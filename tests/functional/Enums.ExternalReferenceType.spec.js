const assert = require('node:assert')
const { suite, test } = require('mocha')

const { getSpecEnum } = require('../_data/specLoader')
const { upperCamelCase } = require('../_helpers/stringFunctions')

const {
  Enums: { ExternalReferenceType }
} = require('../../')

suite('all ExternalReferenceTypes from SPEC are available', () => {
  const schemas = new Map([
    ['1.2', 'bom-1.2.SNAPSHOT.schema.json'],
    ['1.3', 'bom-1.3.SNAPSHOT.schema.json'],
    ['1.4', 'bom-1.4.SNAPSHOT.schema.json']
  ])

  schemas.forEach((resourceFile, specVersion) =>
    suite(`from spec ${specVersion}`, () =>
      getSpecEnum(resourceFile, 'externalReference', 'properties', 'type').forEach(enumValue => {
        let expectedName = upperCamelCase(enumValue)
        switch (enumValue) {
          case 'vcs':
          case 'bom':
            expectedName = enumValue.toUpperCase()
            break
        }
        test(`${expectedName} -> ${enumValue}`, () =>
          assert.strictEqual(ExternalReferenceType[expectedName], enumValue)
        )
      })
    )
  )
})
