/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('node:assert')

const { suite, test } = require('mocha')

const {
  Factories: { LicenseFactory },
  Models: { LicenseExpression, NamedLicense, SpdxLicense }
} = require('../../')

suite('integration: Factories.LicenseFactory', () => {
  test('makeFromString() -> LicenseExpression', () => {
    const sut = new LicenseFactory()
    const expression = '(MIT OR Apache-2.0)'

    const license = sut.makeFromString(expression)

    assert.ok(license instanceof LicenseExpression, license.constructor.name)
    assert.strictEqual(license.expression, expression)
  })

  test('makeFromString() -> NamedLicense', () => {
    const sut = new LicenseFactory()

    const license = sut.makeFromString('(c) foo bar')

    assert.ok(license instanceof NamedLicense, license.constructor.name)
    assert.strictEqual(license.name, '(c) foo bar')
    assert.strictEqual(license.text, undefined)
    assert.strictEqual(license.url, undefined)
  })

  test('makeFromString() -> SpdxLicense', () => {
    const sut = new LicenseFactory()

    const license = sut.makeFromString('MIT')

    assert.ok(license instanceof SpdxLicense, license.constructor.name)
    assert.strictEqual(license.id, 'MIT')
    assert.strictEqual(license.text, undefined)
    assert.strictEqual(license.url, undefined)
  })
})
