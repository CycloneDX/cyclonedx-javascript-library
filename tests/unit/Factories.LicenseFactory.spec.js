const assert = require('assert')
const { suite, test } = require('mocha')

const {
  Factories: { LicenseFactory },
  Models: { LicenseExpression, NamedLicense, SpdxLicense }
} = require('../../')

suite('LicenseFactory', () => {
  test('makeFromString() -> LicenseExpression', () => {
    const sut = new LicenseFactory()

    const license = sut.makeFromString('(MIT or Apache2.0)')

    assert.ok(license instanceof LicenseExpression)
    assert.strictEqual(license.expression, '(MIT or Apache2.0)')
  })

  test('makeFromString() -> NamedLicense', () => {
    const sut = new LicenseFactory()

    const license = sut.makeFromString('(c) foo bar')

    assert.ok(license instanceof NamedLicense)
    assert.strictEqual(license.name, '(c) foo bar')
    assert.strictEqual(license.text, null)
    assert.strictEqual(license.url, null)
  })

  test('makeFromString() -> SpdxLicense', () => {
    const sut = new LicenseFactory()

    const license = sut.makeFromString('MIT')

    assert.ok(license instanceof SpdxLicense)
    assert.strictEqual(license.id, 'MIT')
    assert.strictEqual(license.text, null)
    assert.strictEqual(license.url, null)
  })
})
