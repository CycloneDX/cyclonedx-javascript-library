const assert = require('assert')
const { suite, test } = require('mocha')

const {
  Models: { Bom, ComponentRepository, Metadata }
} = require('../../')

suite('BOM', () => {
  test('construct with empty properties', () => {
    const bom = new Bom()

    assert.ok(bom.metadata instanceof Metadata)
    assert.deepStrictEqual(bom.metadata, new Metadata())
    assert.ok(bom.components instanceof ComponentRepository)
    assert.equal(bom.components.size, 0)
    assert.strictEqual(bom.version, 1)
    assert.strictEqual(bom.serialNumber, undefined)
  })

  test('construct with preset properties', () => {
    const version = Math.round(Math.random() * 1000)
    const serialNumber = 'urn:uuid:12345678-4321-0987-6547-abcdef123456'
    const metadata = new Metadata()
    const components = new ComponentRepository()

    const bom = new Bom({
      version,
      serialNumber,
      metadata,
      components
    })

    assert.strictEqual(bom.version, version)
    assert.strictEqual(bom.serialNumber, serialNumber)
    assert.strictEqual(bom.metadata, metadata)
    assert.strictEqual(bom.components, components)
  })

  suite('can set version', () =>
    [3, 6.0].forEach(newVersion =>
      test(`for: ${newVersion}`, () => {
        const bom = new Bom()
        assert.notStrictEqual(bom.version, newVersion)

        bom.version = newVersion

        assert.strictEqual(bom.version, newVersion)
      })
    )
  )

  suite('cannot set version', () =>
    [
      0, -1, 3.5, -3.5,
      'foo', '3',
      true, false,
      null, undefined,
      [], {}
    ].forEach(newVersion =>
      test(`for: ${newVersion}`, () => {
        const bom = new Bom()
        assert.notStrictEqual(bom.version, newVersion)

        assert.throws(() => {
          bom.version = newVersion
        }, /not PositiveInteger/i)
      })
    )
  )
})
