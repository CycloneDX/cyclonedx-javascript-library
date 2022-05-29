const assert = require('assert')
const { suite, test } = require('mocha')

const { getSpecEnum } = require('../_data/specLoader')
const { upperCamelCase } = require('../_helpers/stringFunctions')

const {
  Enums: { ExternalReferenceType },
  Spec: { Version, SpecVersionDict }
} = require('../../')

suite('ExternalReferenceType enum', () => {
  const schemas = new Map([
    [Version.v1dot2, 'bom-1.2.SNAPSHOT.schema.json'],
    [Version.v1dot3, 'bom-1.3.SNAPSHOT.schema.json'],
    [Version.v1dot4, 'bom-1.4.SNAPSHOT.schema.json']
  ])

  schemas.forEach((resourceFile, specVersion) =>
    suite(`from spec ${specVersion} (${resourceFile})`, () =>
      getSpecEnum(resourceFile, 'externalReference', 'properties', 'type').forEach(enumValue => {
        let expectedName = upperCamelCase(enumValue)
        switch (enumValue) {
          case 'vcs':
          case 'bom':
            expectedName = enumValue.toUpperCase()
            break
        }
        test(`is known: ${expectedName} -> ${enumValue}`, () =>
          assert.strictEqual(ExternalReferenceType[expectedName], enumValue)
        )
        test(`is supported: ${enumValue}`, () =>
          assert.ok(SpecVersionDict[specVersion]?.supportsExternalReferenceType(enumValue))
        )
      })
    )
  )
})
