const assert = require('node:assert')
const { suite, test } = require('mocha')

const { spdxSpecEnum } = require('../_data/spdx')

const { SPDX } = require('../../')

suite('isSupportedSpdxId()', () => {
  const knownSpdxIds = Object.freeze([
    ...spdxSpecEnum
  ])

  suite('knows', () => {
    knownSpdxIds.forEach(value =>
      test(`${value}`, () =>
        assert.strictEqual(SPDX.isSupportedSpdxId(value), true)
      )
    )
  })
})

suite('fixupSpdxId()', () => {
  const expectedFixed = new Map([
    ...spdxSpecEnum.map(v => [v, v]),
    ...spdxSpecEnum.map(v => [v.toLowerCase(), v]),
    ...spdxSpecEnum.map(v => [v.toUpperCase(), v])
  ])

  suite('transform', () => {
    expectedFixed.forEach((expected, value) =>
      test(`${value} -> ${expected}`, () =>
        assert.strictEqual(SPDX.fixupSpdxId(value), expected)
      )
    )
  })
})
