const assert = require('assert')
const { suite, test } = require('mocha')

const { getSpecEnum } = require('../_data/specLoader')
const { upperCamelCase } = require('../_helpers/stringFunctions')

const {
  Enums: { ComponentScope },
  Spec: { Version }
} = require('../../')

suite('ComponentScope enum', () => {
  const schemas = new Map([
    [Version.v1dot2, 'bom-1.2.SNAPSHOT.schema.json'],
    [Version.v1dot3, 'bom-1.3.SNAPSHOT.schema.json'],
    [Version.v1dot4, 'bom-1.4.SNAPSHOT.schema.json']
  ])

  schemas.forEach((resourceFile, specVersion) =>
    suite(`from spec ${specVersion} (${resourceFile})`, () =>
      getSpecEnum(resourceFile, 'component', 'properties', 'scope').forEach(enumValue => {
        const expectedName = upperCamelCase(enumValue)
        test(`is known: ${expectedName} -> ${enumValue}`, () =>
          assert.strictEqual(ComponentScope[expectedName], enumValue)
        )
      })
    )
  )
})
