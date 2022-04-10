const assert = require('assert');
const {suite, test} = require('mocha');

const {fixupSpdxId, isSpdxId} = require('../../').SPDX;

suite('isSpdxId()', () => {

    const knownSpdxIds = Object.freeze(["MIT", "Apache-2.0"])

    suite('is true', () =>
        knownSpdxIds.forEach(value =>
            test(`for: ${value}`, () =>
                assert.strictEqual(isSpdxId(value), true)
            )
        )
    )

    suite('is false', () =>
        [null, undefined, 'fooBarbaz', 'mit'].forEach(value =>
            test(`for: ${value}`, () =>
                assert.strictEqual(isSpdxId(value), false)
            )
        )
    )

})

suite('fixupSpdxId()', () => {

    const expectedFixed = new Map([
        ["MIT", "MIT"],
        ["mit", "MIT"],
        ["Apache-2.0", "Apache-2.0"],
        ["ApAcHe-2.0", "Apache-2.0"],
        ["apache-2.0", "Apache-2.0"]
    ])

    suite('transform', () =>
        expectedFixed.forEach((expected, value) =>
            test(`${value} => ${expected}`, () =>
                assert.strictEqual(fixupSpdxId(value), expected)
            )
        )
    )

    suite('miss', () =>
        [undefined, null, 'fooBarbaz'].forEach((value, expected) =>
            test(`${value}`, () =>
                assert.strictEqual(fixupSpdxId(value), undefined)
            )
        )
    )

})

