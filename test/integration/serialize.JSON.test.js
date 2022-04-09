const assert = require('assert');
const {describe, beforeEach, afterEach, it} = require('mocha');
const {createComplexStructure, serializeResults} = require('../_data/serialize')

const JsonSerialize = require('../../').Serialize.JSON
const {Spec} = require('../../')

describe('JSON serialize', () => {

    [
        // TODO add other versions
        Spec.Spec1_4,
    ].forEach(spec => describe(`complex with spec v${spec.version}`, () => {
        const serializer = new JsonSerialize.Serializer(new JsonSerialize.Normalize.Factory(spec))

        beforeEach(function () {
            this.bom = createComplexStructure()
        })

        afterEach(function () {
            delete this.bom
        })

        it('can serialize', function () {
            const serialized = serializer.serialize(this.bom)

            // TODO: outsource this content
            assert.strictEqual(serialized, serializeResults('complex', spec.version))
        })

        // TODO add more tests
    }))

})
