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

const assert = require('assert')
const { suite, test } = require('mocha')

const {
  Models: {
    Bom, ComponentRepository, Metadata,
    Vulnerability: { VulnerabilityRepository }
  }
} = require('../../')

suite('Models.Bom', () => {
  test('construct with empty properties', () => {
    const bom = new Bom()

    assert.ok(bom.metadata instanceof Metadata)
    assert.deepStrictEqual(bom.metadata, new Metadata())
    assert.ok(bom.components instanceof ComponentRepository)
    assert.strictEqual(bom.components.size, 0)
    assert.ok(bom.vulnerabilities instanceof VulnerabilityRepository)
    assert.strictEqual(bom.vulnerabilities.size, 0)
    assert.strictEqual(bom.version, 1)
    assert.strictEqual(bom.serialNumber, undefined)
  })

  test('construct with preset properties', () => {
    const version = Math.max(1, Math.round(Math.random() * Number.MAX_SAFE_INTEGER))
    const serialNumber = 'urn:uuid:12345678-4321-0987-6547-abcdef123456'
    const metadata = new Metadata()
    const components = new ComponentRepository()
    const vulnerabilities = new VulnerabilityRepository()

    const bom = new Bom({
      version,
      serialNumber,
      metadata,
      components,
      vulnerabilities
    })

    assert.strictEqual(bom.version, version)
    assert.strictEqual(bom.serialNumber, serialNumber)
    assert.strictEqual(bom.metadata, metadata)
    assert.strictEqual(bom.components, components)
    assert.strictEqual(bom.vulnerabilities, vulnerabilities)
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
        assert.throws(
          () => { bom.version = newVersion },
          /not PositiveInteger/i
        )
      })
    )
  )

  suite('can set serialNumber', () => {
    test('empty string', () => {
      const bom = new Bom()
      bom.serialNumber = ''
      assert.strictEqual(bom.serialNumber, undefined)
    })
    test('something', () => {
      const bom = new Bom()
      bom.serialNumber = 'something'
      assert.strictEqual(bom.serialNumber, 'something')
    })
  })
})
