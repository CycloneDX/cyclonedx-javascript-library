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
const { PackageURL } = require('packageurl-js')

const {
  Enums,
  Models,
  Factories: { PackageUrlFactory }
} = require('../../')

suite('integration: Factories.PackageUrlFactory', () => {
  const salt = Math.random()

  const sut = new PackageUrlFactory('testing')

  suite('makeFromComponent', () => {
    test('no-name-no-purl', () => {
      const component = new Models.Component(
        Enums.ComponentType.Library,
        ''
      )
      const expected = undefined

      const actual = sut.makeFromComponent(component)

      assert.strictEqual(actual, expected)
    })

    test('name-group-version', () => {
      const component = new Models.Component(
        Enums.ComponentType.Library,
        `name-${salt}`,
        {
          group: `@group-${salt}`,
          version: `v1+${salt}`,
          externalReferences: new Models.ExternalReferenceRepository([
            new Models.ExternalReference('https://foo.bar', Enums.ExternalReferenceType.Website)
          ])
        }
      )
      const expected = new PackageURL('testing', `@group-${salt}`, `name-${salt}`, `v1+${salt}`, {}, undefined)

      const actual = sut.makeFromComponent(component)

      assert.deepStrictEqual(actual, expected)
    })

    test('extRef[vcs] -> qualifiers.vcs-url without subpath', () => {
      const component = new Models.Component(
        Enums.ComponentType.Library,
        `name-${salt}`,
        {
          externalReferences: new Models.ExternalReferenceRepository([
            new Models.ExternalReference('git+https://foo.bar/repo.git', Enums.ExternalReferenceType.VCS)
          ])
        }
      )
      const expected = new PackageURL('testing', undefined, `name-${salt}`, undefined, { vcs_url: 'git+https://foo.bar/repo.git' }, undefined)

      const actual = sut.makeFromComponent(component)

      assert.deepStrictEqual(actual, expected)
    })

    test('extRef[vcs] -> qualifiers.vcs-url with subpath', () => {
      const component = new Models.Component(
        Enums.ComponentType.Library,
        `name-${salt}`,
        {
          externalReferences: new Models.ExternalReferenceRepository([
            new Models.ExternalReference('git+https://foo.bar/repo.git#sub/path', Enums.ExternalReferenceType.VCS)
          ])
        }
      )
      const expected = new PackageURL('testing', undefined, `name-${salt}`, undefined, { vcs_url: 'git+https://foo.bar/repo.git' }, 'sub/path')

      const actual = sut.makeFromComponent(component)

      assert.deepStrictEqual(actual, expected)
    })

    test('extRef[distribution] -> qualifiers.download_url', () => {
      const component = new Models.Component(
        Enums.ComponentType.Library,
        `name-${salt}`,
        {
          externalReferences: new Models.ExternalReferenceRepository([
            new Models.ExternalReference('https://foo.bar/download', Enums.ExternalReferenceType.Distribution)
          ])
        }
      )
      const expected = new PackageURL('testing', undefined, `name-${salt}`, undefined, { download_url: 'https://foo.bar/download' }, undefined)

      const actual = sut.makeFromComponent(component)

      assert.deepStrictEqual(actual, expected)
    })

    test('extRef empty url -> omit', () => {
      const component = new Models.Component(
        Enums.ComponentType.Library,
        `name-${salt}`,
        {
          externalReferences: new Models.ExternalReferenceRepository([
            new Models.ExternalReference('', Enums.ExternalReferenceType.VCS),
            new Models.ExternalReference('', Enums.ExternalReferenceType.Distribution)
          ])
        }
      )
      const expected = new PackageURL('testing', undefined, `name-${salt}`, undefined, {}, undefined)

      const actual = sut.makeFromComponent(component)

      assert.deepStrictEqual(actual, expected)
    })

    test('hashes -> qualifiers.checksum', () => {
      const component = new Models.Component(
        Enums.ComponentType.Library,
        `name-${salt}`,
        {
          hashes: new Models.HashDictionary([
            [Enums.HashAlgorithm['SHA-256'], 'C3AB8FF13720E8AD9047DD39466B3C8974E592C2FA383D4A3960714CAEF0C4F2']
          ])
        }
      )
      const expected = new PackageURL('testing', undefined, `name-${salt}`, undefined, { checksum: 'sha-256:c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2' }, undefined)

      const actual = sut.makeFromComponent(component)

      assert.deepStrictEqual(actual, expected)
    })

    test('sorted hashes', () => {
      const component = new Models.Component(
        Enums.ComponentType.Library,
        'name',
        {
          externalReferences: new Models.ExternalReferenceRepository([
            new Models.ExternalReference('git+https://foo.bar/repo.git', Enums.ExternalReferenceType.VCS),
            new Models.ExternalReference('https://foo.bar/download', Enums.ExternalReferenceType.Distribution)
          ]),
          hashes: new Models.HashDictionary([
            [Enums.HashAlgorithm['SHA-256'], 'C3AB8FF13720E8AD9047DD39466B3C8974E592C2FA383D4A3960714CAEF0C4F2'],
            [Enums.HashAlgorithm.BLAKE3, 'aa51dcd43d5c6c5203ee16906fd6b35db298b9b2e1de3fce81811d4806b76b7d']
          ])
        }
      )
      const expectedObject = new PackageURL('testing', undefined, 'name', undefined,
        {
          // expect sorted hash list
          checksum: 'blake3:aa51dcd43d5c6c5203ee16906fd6b35db298b9b2e1de3fce81811d4806b76b7d,sha-256:c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2',
          download_url: 'https://foo.bar/download',
          vcs_url: 'git+https://foo.bar/repo.git'
        }, undefined)
      // expect objet's keys in alphabetical oder, expect sorted hash list
      const expectedString = 'pkg:testing/name?checksum=blake3%3Aaa51dcd43d5c6c5203ee16906fd6b35db298b9b2e1de3fce81811d4806b76b7d%2Csha-256%3Ac3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2&download_url=https%3A%2F%2Ffoo.bar%2Fdownload&vcs_url=git%2Bhttps%3A%2F%2Ffoo.bar%2Frepo.git'

      const actual = sut.makeFromComponent(component, true)

      assert.deepStrictEqual(actual, expectedObject)
      assert.deepStrictEqual(actual.toString(), expectedString)
    })

    test('sorted references', () => {
      const component1 = new Models.Component(
        Enums.ComponentType.Library,
        'name',
        {
          externalReferences: new Models.ExternalReferenceRepository([
            new Models.ExternalReference('https://foo.bar/download-1', Enums.ExternalReferenceType.Distribution),
            new Models.ExternalReference('git+https://foo.bar/repo.git', Enums.ExternalReferenceType.VCS),
            new Models.ExternalReference('https://foo.bar/download-2', Enums.ExternalReferenceType.Distribution)
          ])
        }
      )
      const component2 = new Models.Component(
        Enums.ComponentType.Library,
        'name',
        {
          externalReferences: new Models.ExternalReferenceRepository([
            // different order of extRefs
            new Models.ExternalReference('https://foo.bar/download-2', Enums.ExternalReferenceType.Distribution),
            new Models.ExternalReference('git+https://foo.bar/repo.git', Enums.ExternalReferenceType.VCS),
            new Models.ExternalReference('https://foo.bar/download-1', Enums.ExternalReferenceType.Distribution)
          ])
        }
      )
      const expectedObject = new PackageURL('testing', undefined, 'name', undefined,
        {
          // expect sorted hash list
          download_url: 'https://foo.bar/download-2',
          vcs_url: 'git+https://foo.bar/repo.git'
        }, undefined)
      // expect objet's keys in alphabetical oder, expect sorted hash list
      const expectedString = 'pkg:testing/name?download_url=https%3A%2F%2Ffoo.bar%2Fdownload-2&vcs_url=git%2Bhttps%3A%2F%2Ffoo.bar%2Frepo.git'

      const actual1 = sut.makeFromComponent(component1, true)
      const actual2 = sut.makeFromComponent(component2, true)

      assert.deepStrictEqual(actual1, expectedObject)
      assert.deepStrictEqual(actual1.toString(), expectedString)
      assert.deepStrictEqual(actual2, expectedObject)
      assert.deepStrictEqual(actual2.toString(), expectedString)
    })
  })
})
