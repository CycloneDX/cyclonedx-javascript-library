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
  Enums: { ExternalReferenceType, HashAlgorithm },
  Models: { ExternalReference, HashDictionary },
  Contrib,
} = require('../../')

suite('integration: Contrib.FromNodePackageJson.Factories.ExternalReferenceFactory', () => {
  const sut = new Contrib.FromNodePackageJson.Factories.ExternalReferenceFactory()

  suite('from "homepage"', () => {
    test('is non-empty string', () => {
      const expected = [new ExternalReference(
        'https://example.com',
        ExternalReferenceType.Website,
        { comment: 'as detected from PackageJson property "homepage"' }
      )]
      const data = { homepage: 'https://example.com' }
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
        'https://example.com',
        ExternalReferenceType.IssueTracker,
        { comment: 'as detected from PackageJson property "bugs"' }
      )]
      const data = { bugs: 'https://example.com' }
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
        'https://example.com',
        ExternalReferenceType.IssueTracker,
        { comment: 'as detected from PackageJson property "bugs.url"' }
      )]
      const data = { bugs: { url: 'https://example.com' } }
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
    test('non-empty string', () => {
      const expected = [new ExternalReference(
        '../foo/bar',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository"' }
      )]
      const data = { repository: '../foo/bar' }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('implicit-git-url', () => {
      const expected = [new ExternalReference(
        'git+ssh://git@example.com/foo/bar',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository"' }
      )]
      const data = { repository: 'git@example.com:foo/bar' }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('explicit-git-url', () => {
      const expected = [new ExternalReference(
        'git+https://example.com/dings.git',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository"' }
      )]
      const data = { repository: 'git+https://example.com/dings.git' }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('implicit-svn-url', () => {
      const expected = [new ExternalReference(
        'svn://example.com/foo/trunk',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository"' }
      )]
      const data = { repository: 'svn://example.com/foo/trunk' }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('empty string', () => {
      const expected = []
      const data = { repository: '' }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('undefined', () => {
      const expected = []
      const data = { }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
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
      assert.deepStrictEqual(actual, expected)
    })
    test('implicit-git-url', () => {
      const expected = [new ExternalReference(
        'git+ssh://git@example.com/foo/bar',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url"' }
      )]
      const data = { repository: { url: 'git@example.com:foo/bar' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('explicit-git-url', () => {
      const expected = [new ExternalReference(
        'git+https://example.com/dings.git',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url"' }
      )]
      const data = { repository: { url: 'git+https://example.com/dings.git' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('implicit-svn-url', () => {
      const expected = [new ExternalReference(
        'svn://example.com/foo/trunk',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url"' }
      )]
      const data = { repository: { url: 'svn://example.com/foo/trunk' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('empty string', () => {
      const expected = []
      const data = { repository: { url: '' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('undefined', () => {
      const expected = []
      const data = { repository: { } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
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
      assert.deepStrictEqual(actual, expected)
    })
    test('implicit-git-url', () => {
      const expected = [new ExternalReference(
        'git+ssh://git@example.com/foo/bar#some/other%2323/dir%2342',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url" and "repository.directory"' }
      )]
      const data = { repository: { url: 'git@example.com:foo/bar', directory: 'some/other#23/dir#42' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('explicit-git-url', () => {
      const expected = [new ExternalReference(
        'git+https://example.com/dings.git#some/other%2323/dir%2342',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url" and "repository.directory"' }
      )]
      const data = { repository: { url: 'git+https://example.com/dings.git', directory: 'some/other#23/dir#42' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('implicit-svn-url', () => {
      const expected = [new ExternalReference(
        'svn://example.com/foo/trunk#some/other%2323/dir%2342',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url" and "repository.directory"' }
      )]
      const data = { repository: { url: 'svn://example.com/foo/trunk', directory: 'some/other#23/dir#42' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('empty string', () => {
      const expected = [new ExternalReference(
        'http://example.com/foo',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url" and "repository.directory"' }
      )]
      const data = { repository: { url: 'http://example.com/foo', directory: '' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('undefined', () => {
      const expected = [new ExternalReference(
        'http://example.com/foo',
        ExternalReferenceType.VCS,
        { comment: 'as detected from PackageJson property "repository.url"' }
      )]
      const data = { repository: { url: 'http://example.com/foo' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
  })

  suite('from "dist"', () => {
    test('with tarball', () => {
      const expected = [new ExternalReference(
        'https://example.com/foo.tgz',
        ExternalReferenceType.Distribution,
        { comment: 'as detected from PackageJson property "dist.tarball"' }
      )]
      const data = { dist: { tarball: 'https://example.com/foo.tgz' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('with tarball and integrity', () => {
      const expected = [new ExternalReference(
        'https://registry.npmjs.org/light-cycle/-/light-cycle-1.4.3.tgz',
        ExternalReferenceType.Distribution,
        {
          hashes: new HashDictionary([[HashAlgorithm['SHA-512'], 'b0572e8afb0367df5f6344dbbee442e820d707caffca569f8c900c9db485d32e0430cd7fd43b50a38d06d962b3d6b05bca2cf848b01cdd66bac99c82e1748639']]),
          comment: 'as detected from PackageJson property "dist.tarball" and property "dist.integrity"'
        }
      )]
      const data = { dist: { tarball: 'https://registry.npmjs.org/light-cycle/-/light-cycle-1.4.3.tgz', integrity: 'sha512-sFcuivsDZ99fY0TbvuRC6CDXB8r/ylafjJAMnbSF0y4EMM1/1DtQo40G2WKz1rBbyiz4SLAc3Wa6yZyC4XSGOQ==' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('with tarball and shasum', () => {
      const expected = [new ExternalReference(
        'https://registry.npmjs.org/light-cycle/-/light-cycle-1.4.3.tgz',
        ExternalReferenceType.Distribution,
        {
          hashes: new HashDictionary([[HashAlgorithm['SHA-1'], 'c305f0113d81d880f846d84f80c7f3237f197bab']]),
          comment: 'as detected from PackageJson property "dist.tarball" and property "dist.shasum"'
        }
      )]
      const data = { dist: { tarball: 'https://registry.npmjs.org/light-cycle/-/light-cycle-1.4.3.tgz', shasum: 'c305f0113d81d880f846d84f80c7f3237f197bab' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
    test('with tarball and integrity and shasum', () => {
      const expected = [new ExternalReference(
        'https://registry.npmjs.org/light-cycle/-/light-cycle-1.4.3.tgz',
        ExternalReferenceType.Distribution,
        {
          hashes: new HashDictionary([[HashAlgorithm['SHA-1'], 'c305f0113d81d880f846d84f80c7f3237f197bab'], [HashAlgorithm['SHA-512'], 'b0572e8afb0367df5f6344dbbee442e820d707caffca569f8c900c9db485d32e0430cd7fd43b50a38d06d962b3d6b05bca2cf848b01cdd66bac99c82e1748639']]),
          comment: 'as detected from PackageJson property "dist.tarball" and property "dist.integrity" and property "dist.shasum"'
        }
      )]
      const data = { dist: { tarball: 'https://registry.npmjs.org/light-cycle/-/light-cycle-1.4.3.tgz', integrity: 'sha512-sFcuivsDZ99fY0TbvuRC6CDXB8r/ylafjJAMnbSF0y4EMM1/1DtQo40G2WKz1rBbyiz4SLAc3Wa6yZyC4XSGOQ==', shasum: 'c305f0113d81d880f846d84f80c7f3237f197bab' } }
      const actual = sut.makeExternalReferences(data)
      assert.deepStrictEqual(actual, expected)
    })
  })
})
