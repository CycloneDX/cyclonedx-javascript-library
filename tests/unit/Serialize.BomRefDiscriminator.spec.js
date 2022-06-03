'use strict'
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
  Models: { BomRef },
  Serialize: { BomRefDiscriminator }
} = require('../../')

suite('BomRefDiscriminator', () => {
  test('does not alter BomRef.value unintended', () => {
    const bomRef1 = new BomRef()
    const bomRef2 = new BomRef('foo')

    assert.strictEqual(bomRef1.value, undefined)
    assert.strictEqual(bomRef2.value, 'foo')

    /* eslint-disable-next-line no-unused-vars */
    const discriminator = new BomRefDiscriminator([bomRef1, bomRef2])

    assert.strictEqual(bomRef1.value, undefined)
    assert.strictEqual(bomRef2.value, 'foo')
  })

  test('does not alter BomRef.value unnecessary', () => {
    const bomRef1 = new BomRef('foo')
    const bomRef2 = new BomRef('foo')

    assert.strictEqual(bomRef1.value, 'foo')
    assert.strictEqual(bomRef2.value, 'foo')

    /* eslint-disable-next-line no-unused-vars */
    const discriminator = new BomRefDiscriminator([bomRef1, bomRef2])
    discriminator.discriminate()

    assert.notStrictEqual(bomRef1.value, bomRef2.value)
    assert.ok(bomRef1.value === 'foo' || bomRef2.value === 'foo')
  })

  test('does discriminate BomRef.value', () => {
    const bomRef1 = new BomRef()
    const bomRef2 = new BomRef('foo')
    const bomRef3 = new BomRef()
    const bomRef4 = new BomRef('foo')

    const discriminator = new BomRefDiscriminator([bomRef1, bomRef2, bomRef3, bomRef4])
    assert.strictEqual(bomRef1.value, undefined)
    assert.strictEqual(bomRef2.value, 'foo')
    assert.strictEqual(bomRef3.value, undefined)
    assert.strictEqual(bomRef4.value, 'foo')

    discriminator.discriminate()
    assert.ok(typeof bomRef1.value === 'string')
    assert.ok(typeof bomRef2.value === 'string')
    assert.ok(typeof bomRef3.value === 'string')
    assert.ok(typeof bomRef4.value === 'string')

    assert.notStrictEqual(bomRef2.value, bomRef1.value)
    assert.notStrictEqual(bomRef3.value, bomRef1.value)
    assert.notStrictEqual(bomRef4.value, bomRef1.value)

    assert.notStrictEqual(bomRef1.value, bomRef2.value)
    assert.notStrictEqual(bomRef3.value, bomRef2.value)
    assert.notStrictEqual(bomRef4.value, bomRef2.value)

    assert.notStrictEqual(bomRef1.value, bomRef3.value)
    assert.notStrictEqual(bomRef2.value, bomRef3.value)
    assert.notStrictEqual(bomRef4.value, bomRef3.value)

    assert.notStrictEqual(bomRef1.value, bomRef4.value)
    assert.notStrictEqual(bomRef2.value, bomRef4.value)
    assert.notStrictEqual(bomRef3.value, bomRef4.value)
  })

  test('does reset BomRef.value', () => {
    const bomRef1 = new BomRef()
    const bomRef2 = new BomRef('foo')
    const bomRef3 = new BomRef()
    const bomRef4 = new BomRef('bar')

    const discriminator = new BomRefDiscriminator([bomRef1, bomRef2, bomRef3, bomRef4])
    assert.strictEqual(bomRef1.value, undefined)
    assert.strictEqual(bomRef2.value, 'foo')
    assert.strictEqual(bomRef3.value, undefined)
    assert.strictEqual(bomRef4.value, 'bar')

    // intentional modification
    bomRef1.value = bomRef2.value = bomRef3.value = bomRef4.value = 'bar'
    assert.strictEqual(bomRef1.value, 'bar')
    assert.strictEqual(bomRef2.value, 'bar')
    assert.strictEqual(bomRef3.value, 'bar')
    assert.strictEqual(bomRef4.value, 'bar')

    discriminator.reset()
    assert.strictEqual(bomRef1.value, undefined)
    assert.strictEqual(bomRef2.value, 'foo')
    assert.strictEqual(bomRef3.value, undefined)
    assert.strictEqual(bomRef4.value, 'bar')
  })
})
