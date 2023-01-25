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
  Models: {
    Component, ComponentRepository,
    BomRef, BomRefRepository,
    ExternalReferenceRepository, ExternalReference,
    HashDictionary,
    LicenseRepository, NamedLicense,
    OrganizationalEntity,
    SWID
  }
} = require('../../')

suite('Models.Component', () => {
  test('constructor', () => {
    const component = new Component('application', 'foobar')

    assert.strictEqual(component.type, 'application')
    assert.strictEqual(component.name, 'foobar')
    assert.strictEqual(component.author, undefined)
    assert.strictEqual(component.bomRef.value, undefined)
    assert.strictEqual(component.copyright, undefined)
    assert.strictEqual(component.cpe, undefined)
    assert.strictEqual(component.dependencies.size, 0)
    assert.strictEqual(component.description, undefined)
    assert.strictEqual(component.externalReferences.size, 0)
    assert.strictEqual(component.group, undefined)
    assert.strictEqual(component.hashes.size, 0)
    assert.strictEqual(component.licenses.size, 0)
    assert.strictEqual(component.purl, undefined)
    assert.strictEqual(component.scope, undefined)
    assert.strictEqual(component.supplier, undefined)
    assert.strictEqual(component.swid, undefined)
    assert.strictEqual(component.version, undefined)
    assert.strictEqual(component.components.size, 0)
  })

  test('constructor with OptionalProperties', () => {
    const dummyBomRef = new BomRef('testing')
    const dummyExtRef = new ExternalReference('../', 'other')
    const dummyLicense = new NamedLicense('mine')
    const dummyPurl = new PackageURL('npm', 'ns', 'app', '1.33.7', {}, undefined)
    const dummySupplier = new OrganizationalEntity({ name: 'dummySupplier' })
    const dummySWID = new SWID('my-fake-swid', 'foo-bar')
    const subComponent = new Component('library', 'MySubComponent')

    const component = new Component('application', 'foobar', {
      author: 'my author',
      bomRef: 'my-bomref',
      copyright: 'my copyright',
      cpe: 'cpe:2.3:a:microsoft:internet_explorer:8.0.6001:beta:*:*:*:*:*:*',
      dependencies: new BomRefRepository([dummyBomRef]),
      description: 'this is a test',
      externalReferences: new ExternalReferenceRepository([dummyExtRef]),
      group: 'the-crew',
      hashes: new HashDictionary([['MD5', '59bcc3ad6775562f845953cf01624225']]),
      licenses: new LicenseRepository([dummyLicense]),
      purl: dummyPurl,
      scope: 'optional',
      supplier: dummySupplier,
      swid: dummySWID,
      version: '1.33.7',
      components: new ComponentRepository([subComponent])
    })

    assert.strictEqual(component.type, 'application')
    assert.strictEqual(component.name, 'foobar')
    assert.strictEqual(component.author, 'my author')
    assert.strictEqual(component.bomRef.value, 'my-bomref')
    assert.strictEqual(component.copyright, 'my copyright')
    assert.strictEqual(component.cpe, 'cpe:2.3:a:microsoft:internet_explorer:8.0.6001:beta:*:*:*:*:*:*')
    assert.strictEqual(component.dependencies.size, 1)
    assert.strictEqual(Array.from(component.dependencies)[0], dummyBomRef)
    assert.strictEqual(component.description, 'this is a test')
    assert.strictEqual(component.externalReferences.size, 1)
    assert.strictEqual(Array.from(component.externalReferences)[0], dummyExtRef)
    assert.strictEqual(component.group, 'the-crew')
    assert.strictEqual(component.hashes.size, 1)
    assert.strictEqual(component.hashes.get('MD5'), '59bcc3ad6775562f845953cf01624225')
    assert.strictEqual(component.licenses.size, 1)
    assert.strictEqual(Array.from(component.licenses)[0], dummyLicense)
    assert.strictEqual(component.purl, dummyPurl)
    assert.strictEqual(component.scope, 'optional')
    assert.strictEqual(component.supplier, dummySupplier)
    assert.strictEqual(component.swid, dummySWID)
    assert.strictEqual(component.version, '1.33.7')
    assert.strictEqual(component.components.size, 1)
    assert.strictEqual(Array.from(component.components)[0], subComponent)
  })
})
