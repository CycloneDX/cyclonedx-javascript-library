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

const { PackageURL } = require('packageurl-js')

const {
  Enums,
  Models,
  Factories: { PackageUrlFactory }
} = require('../../')

suite('Factories.PackageUrlFactory', () => {
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
            new Models.ExternalReference('git://foo.bar', Enums.ExternalReferenceType.VCS)
          ])
        }
      )
      const expected = new PackageURL('testing', undefined, `name-${salt}`, undefined, { vcs_url: 'git://foo.bar' }, undefined)
      const actual = sut.makeFromComponent(component)
      assert.deepStrictEqual(actual, expected)
    })

    test('extRef[vcs] -> qualifiers.vcs-url with subpath', () => {
      const component = new Models.Component(
        Enums.ComponentType.Library,
        `name-${salt}`,
        {
          externalReferences: new Models.ExternalReferenceRepository([
            new Models.ExternalReference('git://foo.bar#sub/path', Enums.ExternalReferenceType.VCS)
          ])
        }
      )
      const expected = new PackageURL('testing', undefined, `name-${salt}`, undefined, { vcs_url: 'git://foo.bar' }, 'sub/path')
      const actual = sut.makeFromComponent(component)
      assert.deepStrictEqual(actual, expected)
    })

    test('extRef[distribution] -> qualifiers.download_url', () => {
      assert.strictEqual(false, true, 'TODO')
    })

    test('hashes -> qualifiers.checksum', () => {
      assert.strictEqual(false, true, 'TODO')
    })

    test('sorted', () => {
      assert.strictEqual(false, true, 'TODO')
    })
  })


})
