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
  Enums: { ExternalReferenceType },
  Models: { ExternalReference },
  Factories: { FromNodePackageJson: { ExternalReferenceFactory } }
} = require('../../')

suite('integration: Factories.FromNodePackageJson.ExternalReferenceFactory', () => {
  const sut = new ExternalReferenceFactory()

  suite('from "homepage"', () => {
    test('is non-empty string', () => {
      const expected = [new ExternalReference(
        'https://example.com',
        ExternalReferenceType.Website,
        { comment: 'as detected from PackageJson property "homepage"' }
      )]
      const data = { homepage: 'https://example.com' }
      const actual = sut.makeExternalReferences(data)
      assert.deepEqual(actual, expected)
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
        'https://example.com',
        ExternalReferenceType.IssueTracker,
        { comment: 'as detected from PackageJson property "bugs"' }
      )]
      const data = { bugs: 'https://example.com' }
      const actual = sut.makeExternalReferences(data)
      assert.deepEqual(actual, expected)
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
        'https://example.com',
        ExternalReferenceType.IssueTracker,
        { comment: 'as detected from PackageJson property "bugs.url"' }
      )]
      const data = { bugs: { url: 'https://example.com' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepEqual(actual, expected)
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
    test('non-empty string', () => {
      const expected = [new ExternalReference(
        '../foo/bar',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository"' }
      )]
      const data = { repository:  '../foo/bar' }
      const actual = sut.makeExternalReferences(data)
      assert.deepEqual(actual, expected)
    })
    test('implicit-git-url', () => {
      const expected = [new ExternalReference(
        'git+ssh://git@example.com/foo/bar',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository"' }
      )]
      const data = { repository:  'git@example.com:foo/bar'}
      const actual = sut.makeExternalReferences(data)
      assert.deepEqual(actual, expected)
    })
    test('explicit-git-url', () => {
      const expected = [new ExternalReference(
        'git+https://example.com/dings.git',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository"' }
      )]
      const data = { repository: 'git+https://example.com/dings.git' }
      const actual = sut.makeExternalReferences(data)
      assert.deepEqual(actual, expected)
    })
    test('implicit-svn-url', () => {
      const expected = [new ExternalReference(
        'svn://example.com/foo/trunk',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository"' }
      )]
      const data = { repository:  'svn://example.com/foo/trunk' }
      const actual = sut.makeExternalReferences(data)
      assert.deepEqual(actual, expected)
    })
    test('empty string', () => {
      const expected = []
      const data = { repository:  '' }
      const actual = sut.makeExternalReferences(data)
      assert.deepEqual(actual, expected)
    })
    test('undefined', () => {
      const expected = []
      const data = {  }
      const actual = sut.makeExternalReferences(data)
      assert.deepEqual(actual, expected)
    })
  })
  suite('from "repository.url"', () => {
    test('non-empty string', () => {
      const expected = [new ExternalReference(
        '../foo/bar',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url"' }
      )]
      const data = { repository: { url: '../foo/bar' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepEqual(actual, expected)
    })
    test('implicit-git-url', () => {
      const expected = [new ExternalReference(
        'git+ssh://git@example.com/foo/bar',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url"' }
      )]
      const data = { repository: { url: 'git@example.com:foo/bar'} }
      const actual = sut.makeExternalReferences(data)
      assert.deepEqual(actual, expected)
    })
    test('explicit-git-url', () => {
      const expected = [new ExternalReference(
        'git+https://example.com/dings.git',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url"' }
      )]
      const data = { repository: { url: 'git+https://example.com/dings.git' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepEqual(actual, expected)
    })
    test('implicit-svn-url', () => {
      const expected = [new ExternalReference(
        'svn://example.com/foo/trunk',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url"' }
      )]
      const data = { repository: { url: 'svn://example.com/foo/trunk' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepEqual(actual, expected)
    })
    test('empty string', () => {
      const expected = []
      const data = { repository: { url: '' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepEqual(actual, expected)
    })
    test('undefined', () => {
      const expected = []
      const data = { repository: {  } }
      const actual = sut.makeExternalReferences(data)
      assert.deepEqual(actual, expected)
    })
  })
  suite('from "repository.directory"', () => {
    test('non-empty string', () => {
      const expected = [new ExternalReference(
        '../foo/bar',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url"' }
      )]
      const data = { repository: { url: '../foo/bar', directory: 'some/other#23/dir#42' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepEqual(actual, expected)
    })
    test('implicit-git-url', () => {
      const expected = [new ExternalReference(
        'git+ssh://git@example.com/foo/bar#some/other%2323/dir%2342',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url" and "repository.directory"' }
      )]
      const data = { repository: { url: 'git@example.com:foo/bar', directory: 'some/other#23/dir#42'} }
      const actual = sut.makeExternalReferences(data)
      assert.deepEqual(actual, expected)
    })
    test('explicit-git-url', () => {
      const expected = [new ExternalReference(
        'git+https://example.com/dings.git#some/other%2323/dir%2342',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url" and "repository.directory"' }
      )]
      const data = { repository: { url: 'git+https://example.com/dings.git', directory: 'some/other#23/dir#42' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepEqual(actual, expected)
    })
    test('implicit-svn-url', () => {
      const expected = [new ExternalReference(
        'svn://example.com/foo/trunk#some/other%2323/dir%2342',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url" and "repository.directory"' }
      )]
      const data = { repository: { url: 'svn://example.com/foo/trunk', directory: 'some/other#23/dir#42' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepEqual(actual, expected)
    })
    test('empty string', () => {
      const expected = [new ExternalReference(
        'http://example.com/foo',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url" and "repository.directory"' }
      )]
      const data = { repository: { url: 'http://example.com/foo', directory: '' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepEqual(actual, expected)
    })
    test('undefined', () => {
      const expected = [new ExternalReference(
        'http://example.com/foo',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url"' }
      )]
      const data = { repository: { url: 'http://example.com/foo' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepEqual(actual, expected)
    })
  })
})
