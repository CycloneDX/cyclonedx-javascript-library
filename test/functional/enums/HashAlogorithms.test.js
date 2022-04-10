const assert = require('assert');
const {suite, test} = require('mocha');
const enumLoader = require('../../_data/enumLoader')

const {HashAlgorithm} = require('../../../').Enums

suite('all values from SPEC are available', () => {
    suite('from spec 1.4', () => {
        enumLoader(
            'bom-1.4.SNAPSHOT.schema.json',
            'hash-alg'
        ).forEach(expected =>
            test(`${expected}`, () => {
                assert.ok(HashAlgorithm.hasOwnProperty(expected))
                assert.strictEqual(HashAlgorithm[expected], expected)
            })
        )
    })
})
