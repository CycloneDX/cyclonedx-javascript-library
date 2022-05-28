const assert = require('assert')
const { suite, test } = require('mocha')

const { getSpecEnum } = require('../_data/specLoader')
const { upperCamelCase } = require('../_helpers/stringFunctions')

const {
  Enums: { ComponentType }
} = require('../../')

suite('all ComponentTypes from SPEC are available', () => {
  const schemas = new Map([
    ['1.2', 'bom-1.2.SNAPSHOT.schema.json'],
    ['1.3', 'bom-1.3.SNAPSHOT.schema.json'],
    ['1.4', 'bom-1.4.SNAPSHOT.schema.json']
  ])

  schemas.forEach((resourceFile, specVersion) =>
    suite(`from spec ${specVersion}`, () =>
      getSpecEnum(resourceFile, 'component', 'properties', 'type').forEach(enumValue => {
        const expectedName = upperCamelCase(enumValue)
        test(`${expectedName} -> ${enumValue}`, () =>
          assert.strictEqual(ComponentType[expectedName], enumValue)
        )
      })
    )
  )
})
