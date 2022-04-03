const assert = require('assert');
const {spdx:{
    fixupSpdxId, isSpdxId
}} = require('../../');

describe('isSpdxId()', () => {

    const knownSpdxIds = ["MIT", "Apache-2.0"]

    describe('is true', () => {
        knownSpdxIds.forEach(value => {
            it(`for: ${value}`, () => {
                assert.strictEqual(isSpdxId(value), true)
            })
        })
    })

    describe('is false', () => {
        [null, undefined, 'fooBarbaz', 'mit'].forEach(value => {
            it(`for: ${value}`, () => {
                assert.strictEqual(isSpdxId(value), false)
            })
        })
    })

})

describe('fixupSpdxId()', () => {

    const expectedFixed = new Map([
        ["MIT", "MIT"],
        ["mit", "MIT"],
        ["Apache-2.0", "Apache-2.0"],
        ["ApAcHe-2.0", "Apache-2.0"],
        ["apache-2.0", "Apache-2.0"]
    ])

    describe('transform', () => {
        expectedFixed.forEach((expected, value) => {
            it(`${value} -> ${expected}`, () => {
                assert.strictEqual(fixupSpdxId(value), expected)
            })
        })
    })

    describe('miss', () => {
        [undefined, null, 'fooBarbaz'].forEach((value, expected) => {
            it(`${value}`, () => {
                assert.strictEqual(fixupSpdxId(value), undefined)
            })
        })
    })

})

