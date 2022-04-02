const assert = require('assert');
const {spdxSpecEnum} = require('../_data/spdx')
const {spdx} = require('../../');

describe('isSpdxId()', () => {

    const knownSpdxIds = [
        ...spdxSpecEnum
    ]

    describe('knows', () => {
        knownSpdxIds.forEach(value => {
            it(`${value}`, () => {
                assert.strictEqual(spdx.isSpdxId(value), true)
            })
        })
    })

})

describe('fixupSpdxId()', () => {

    const expectedFixed = new Map([
        ...spdxSpecEnum.map(v => [v, v]),
        ...spdxSpecEnum.map(v => [v.toLowerCase(), v]),
        ...spdxSpecEnum.map(v => [v.toUpperCase(), v]),
    ])

    describe('transform', () => {
        expectedFixed.forEach((expected, value) => {
            it(`${value} -> ${expected}`, () => {
                assert.strictEqual(spdx.fixupSpdxId(value), expected)
            })
        })
    })

})

