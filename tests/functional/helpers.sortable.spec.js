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

const { SortableComparables, SortableNumbers, SortableStringables } = require('../../dist.node/_helpers/sortable')

suite('functional: helpers.sortable', () => {
  suite('SortableStringables', () => {
    test('sorted()', () => {
      const obj = { toString: () => 'bar' }
      const sortable = new SortableStringables(['foo', obj, 'fo', 'fo'])
      const expected = [obj, 'fo', 'foo']

      const actual = sortable.sorted()
      assert.deepStrictEqual(actual, expected)
    })

    suite('compare()', () => {
      [
        [['foo'], [], 1],
        [[], ['foo'], -1]
      ].forEach(([sortedA, sortedB, expected]) => {
        test('different length', () => {
          const sortableA = new SortableStringables()
          sortableA.sorted = () => sortedA
          const sortableB = new SortableStringables()
          sortableB.sorted = () => sortedB

          const actual = sortableA.compare(sortableB)
          assert.deepStrictEqual(actual, expected)
        })
      })

      test('same length, different content', () => {
        const sortableA = new SortableStringables()
        sortableA.sorted = () => ['foo']
        const sortableB = new SortableStringables()
        sortableB.sorted = () => ['bar']

        const actual = sortableA.compare(sortableB)
        assert.deepStrictEqual(actual, 1)
      })

      test('same length, same content', () => {
        const sortableA = new SortableStringables()
        sortableA.sorted = () => ['foo']
        const sortableB = new SortableStringables()
        sortableB.sorted = () => ['foo']

        const actual = sortableA.compare(sortableB)
        assert.deepStrictEqual(actual, 0)
      })
    })
  })

  suite('SortableNumbers', () => {
    test('sorted()', () => {
      const sortable = new SortableNumbers([1, 7, 3, 42, 23, 3, -1337])
      const expected = [-1337, 1, 3, 7, 23, 42]

      const actual = sortable.sorted()
      assert.deepStrictEqual(actual, expected)
    })

    suite('compare()', () => {
      [
        [[1], [], 1],
        [[], [1], -1]
      ].forEach(([sortedA, sortedB, expected]) => {
        test('different length', () => {
          const sortableA = new SortableNumbers()
          sortableA.sorted = () => sortedA
          const sortableB = new SortableNumbers()
          sortableB.sorted = () => sortedB

          const actual = sortableA.compare(sortableB)
          assert.deepStrictEqual(actual, expected)
        })
      })

      test('same length, different content', () => {
        const sortableA = new SortableNumbers()
        sortableA.sorted = () => [23]
        const sortableB = new SortableNumbers()
        sortableB.sorted = () => [0]

        const actual = sortableA.compare(sortableB)
        assert.deepStrictEqual(actual, 23)
      })

      test('same length, same content', () => {
        const sortableA = new SortableNumbers()
        sortableA.sorted = () => [23]
        const sortableB = new SortableNumbers()
        sortableB.sorted = () => [23]

        const actual = sortableA.compare(sortableB)
        assert.deepStrictEqual(actual, 0)
      })
    })
  })

  suite('SortableComparables', () => {
    test('sorted()', () => {
      const left = { compare: () => -1, tag: 'left' }
      const stay = { compare: () => +0, tag: 'stay' }
      const right = { compare: () => +1, tag: 'right' }
      const sortable = new SortableComparables([right, left, stay, stay])
      const expected = [left, right, stay]

      const actual = sortable.sorted()
      assert.deepStrictEqual(actual, expected)
    })

    suite('compare()', () => {
      [
        [[{ compare: () => 0 }], [], 1],
        [[], [{ compare: () => 0 }], -1]
      ].forEach(([sortedA, sortedB, expected]) => {
        test('different length', () => {
          const sortableA = new SortableComparables()
          sortableA.sorted = () => sortedA
          const sortableB = new SortableComparables()
          sortableB.sorted = () => sortedB

          const actual = sortableA.compare(sortableB)
          assert.deepStrictEqual(actual, expected)
        })
      })

      test('same length, different content', () => {
        const sortableA = new SortableComparables()
        sortableA.sorted = () => [{ compare: () => 23 }]
        const sortableB = new SortableComparables()
        sortableB.sorted = () => [{ compare: () => 23 }]

        const actual = sortableA.compare(sortableB)
        assert.deepStrictEqual(actual, 23)
      })

      test('same length, same content', () => {
        const sortableA = new SortableComparables()
        sortableA.sorted = () => [{ compare: () => 0 }]
        const sortableB = new SortableComparables()
        sortableB.sorted = () => [{ compare: () => 0 }]

        const actual = sortableA.compare(sortableB)
        assert.deepStrictEqual(actual, 0)
      })
    })
  })
})
