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

const stringFunctions = require('./stringFunctions')

suite('test helpers: stringFunctions', () => {
  suite('capitaliseFirstLetter()', () => {
    [
      ['foo', 'Foo'],
      ['Bar', 'Bar'],
      ['foo bar', 'Foo bar'],
      ['', '']
    ].forEach(([value, expected]) =>
      test(`for value: ${value}`, () =>
        assert.strictEqual(stringFunctions.capitaliseFirstLetter(value), expected)
      )
    )
  })

  suite('upperCamelCase()', () => {
    [
      ['foo', 'Foo'],
      ['Bar', 'Bar'],
      ['FooBar', 'FooBar'],
      // region space delimiter
      ['foo bar', 'FooBar'],
      ['Foo bar', 'FooBar'],
      ['foo Bar', 'FooBar'],
      ['Foo bar', 'FooBar'],
      // endregion space delimiter
      // region dot delimiter
      ['foo.bar', 'FooBar'],
      ['Foo.bar', 'FooBar'],
      ['foo.Bar', 'FooBar'],
      ['Foo.bar', 'FooBar'],
      // endregion dot delimiter
      // region hyphen delimiter
      ['foo-bar', 'FooBar'],
      ['Foo-bar', 'FooBar'],
      ['foo-Bar', 'FooBar'],
      ['Foo-bar', 'FooBar'],
      // endregion hyphen delimiter
      // region underscore delimiter
      ['foo_bar', 'FooBar'],
      ['Foo_bar', 'FooBar'],
      ['foo_Bar', 'FooBar'],
      ['Foo_bar', 'FooBar'],
      // endregion underscore delimiter
      ['', '']
    ].forEach(([value, expected]) =>
      test(`for value: ${value}`, () =>
        assert.strictEqual(stringFunctions.upperCamelCase(value), expected)
      )
    )
  })

  suite('randomString()', () => {
    [10, 5, 1, 0].forEach(length =>
      test(`for length: ${length}`, () => {
        const value = stringFunctions.randomString(length)
        assert.strictEqual(length, value.length)
      })
    )
  })

  suite('escapeRegExp()', () => {
    test('escapes only reserved', () => {
      assert.strictEqual(
        stringFunctions.escapeRegExp('^a([sd]*f? f+o{3}o.|ba\\r)$'),
        '\\^a\\(\\[sd\\]\\*f\\? f\\+o\\{3\\}o\\.\\|ba\\\\r\\)\\$'
      )
    })
  })
})
