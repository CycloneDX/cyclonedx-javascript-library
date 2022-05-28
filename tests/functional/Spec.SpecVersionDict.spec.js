const assert = require('node:assert')
const { suite, test } = require('mocha')

const {
  Spec: { SpecVersionDict, Version }
} = require('../../')

suite('SpecVersionDict', () => {
  Object.entries(SpecVersionDict).forEach(([key, spec]) =>
    suite(`key: ${key}`, () => {
      test('key is well-known version', () =>
        assert.ok(Object.values(Version).includes(key))
      )
      test('spec version equals key', () =>
        assert.equal(spec.version, key)
      )
    })
  )
})
