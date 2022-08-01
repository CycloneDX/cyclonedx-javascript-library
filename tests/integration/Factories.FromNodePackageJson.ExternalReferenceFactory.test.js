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
  Enums: { ExternalReferenceType },
  Models: { ExternalReference },
  Factories: { FromNodePackageJson: { ExternalReferenceFactory } }
} = require('../../')

suite('Factories.FromNodePackageJson.ExternalReferenceFactory', () => {
  const sut = new ExternalReferenceFactory()

  suite('from "homepage"', () => {
    test('is non-empty string', () => {
      const expected = [new ExternalReference(
        'https://foo.bar',
        ExternalReferenceType.Website,
        { comment: 'as detected from PackageJson property "homepage"' }
      )]
      const data = { homepage: 'https://foo.bar' }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('is empty string', () => {
      const data = { homepage: '' }
      const actual = sut.makeExternalReferences(data)
      assert.strictEqual(actual.length, 0)
    })
    test('is undefined', () => {
      const data = { homepage: undefined }
      const actual = sut.makeExternalReferences(data)
      assert.strictEqual(actual.length, 0)
    })
  })

  suite('from "bugs"', () => {
    test('is non-empty string', () => {
      const expected = [new ExternalReference(
        'https://foo.bar',
        ExternalReferenceType.IssueTracker,
        { comment: 'as detected from PackageJson property "bugs"' }
      )]
      const data = { bugs: 'https://foo.bar' }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('is empty string', () => {
      const data = { bugs: '' }
      const actual = sut.makeExternalReferences(data)
      assert.strictEqual(actual.length, 0)
    })
    test('is undefined', () => {
      const data = { bugs: undefined }
      const actual = sut.makeExternalReferences(data)
      assert.strictEqual(actual.length, 0)
    })
  })
  suite('from "bugs.url"', () => {
    test('is non-empty string', () => {
      const expected = [new ExternalReference(
        'https://foo.bar',
        ExternalReferenceType.IssueTracker,
        { comment: 'as detected from PackageJson property "bugs.url"' }
      )]
      const data = { bugs: { url: 'https://foo.bar' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('is empty string', () => {
      const data = { bugs: { url: '' } }
      const actual = sut.makeExternalReferences(data)
      assert.strictEqual(actual.length, 0)
    })
    test('is undefined', () => {
      const data = { bugs: { url: undefined } }
      const actual = sut.makeExternalReferences(data)
      assert.strictEqual(actual.length, 0)
    })
  })
  suite('from "repository"', () => {
    test('is non-empty string', () => {
      const expected = [new ExternalReference(
        'https://foo.bar',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository"' }
      )]
      const data = { repository: 'https://foo.bar' }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('is empty string', () => {
      const data = { repository: '' }
      const actual = sut.makeExternalReferences(data)
      assert.strictEqual(actual.length, 0)
    })
    test('is undefined', () => {
      const data = { repository: undefined }
      const actual = sut.makeExternalReferences(data)
      assert.strictEqual(actual.length, 0)
    })
  })
  suite('from "repository.url"', () => {
    test('is non-empty string', () => {
      const expected = [new ExternalReference(
        'https://foo.bar',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url"' }
      )]
      const data = { repository: { url: 'https://foo.bar' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('is empty string', () => {
      const data = { repository: { url: '' } }
      const repo = sut.makeExternalReferences(data)
      assert.strictEqual(repo.length, 0)
    })
    test('is undefined', () => {
      const data = { repository: { url: undefined } }
      const actual = sut.makeExternalReferences(data)
      assert.strictEqual(actual.length, 0)
    })
  })
  suite('from "repository.directory"', () => {
    test('is non-empty string', () => {
      const expected = [new ExternalReference(
        'https://foo.bar#some/dir',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url" and "repository.directory"' }
      )]
      const data = { repository: { url: 'https://foo.bar', directory: 'some/dir' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('is empty string', () => {
      const data = { repository: { directory: '' } }
      const actual = sut.makeExternalReferences(data)
      assert.strictEqual(actual.length, 0)
    })
    test('is undefined', () => {
      const data = { repository: { directory: undefined } }
      const actual = sut.makeExternalReferences(data)
      assert.strictEqual(actual.length, 0)
    })
  })
})
