const assert = require('assert');
const {models: {Bom, Metadata, ComponentRepository}} = require("../../../");

describe('BOM', () => {

    it('construct with basic properties', () => {
        const bom = new Bom()

        assert.ok(bom.metadata instanceof Metadata)
        assert.ok(bom.components instanceof ComponentRepository)
        assert.strictEqual(bom.version, 1)
        assert.strictEqual(bom.serialNumber, null)
    })

    describe('can set version', () => {
        [3, 6.0].forEach(newVersion => {
            it(`for: ${newVersion}`, () => {
                const bom = new Bom()
                assert.notStrictEqual(bom.version, newVersion)

                bom.version = newVersion

                assert.strictEqual(bom.version, newVersion)
            })
        })
    })

    describe('cannot set version', () => {
        [0, -1, 3.5, -3.5, 'foo', '3', true, false, null, undefined, ['list'], {'ob': 'ject'}].forEach(newVersion => {
            it(`for: ${newVersion}`, () => {
                const bom = new Bom()
                assert.notStrictEqual(bom.version, newVersion)

                assert.throws(() => {
                    bom.version = newVersion
                }, new RegExp('not PositiveInteger'))
            })
        })
    })


})
