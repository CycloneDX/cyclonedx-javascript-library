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
  Factories: { FromNodePackageJson: {
    ExternalReferenceFactory, PackageUrlFactory
  }},
  Enums: { ComponentType, ExternalReferenceType },
  Models: { Component, ExternalReference, ExternalReferenceRepository }
} = require('../../')

suite('unit: Factories.FromNodePackageJson.ExternalReferenceFactory', () => {
  // TODO
})

suite('unit: Factories.FromNodePackageJson.PackageUrlFactory', () => {
  suite('makeFromComponent()', () => {
    test('plain', () => {
      const component = new Component(ComponentType.Library, 'testing')
      const purlFac = new PackageUrlFactory('npm')
      const actual = purlFac.makeFromComponent(component)
      assert.deepEqual(actual, 'TODO')
    })

    test('strips default registry from qualifiers', () => {
      // see https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#npm
      const component = new Component(ComponentType.Library, 'testing', {
        externalReferences: new ExternalReferenceRepository([
          new ExternalReference(
            'https://registry.npmjs.org/@cyclonedx/cyclonedx-library/-/cyclonedx-library-1.0.0-beta.2.tgz',
            ExternalReferenceType.Distribution
          )
        ])
      })
      const purlFac = new PackageUrlFactory('npm')
      const actual = purlFac.makeFromComponent(component)
      assert.deepEqual(actual, {
        type: 'npm',
        name: 'testing',
        namespace: undefined,
        version: undefined,
        qualifiers: undefined,
        subpath: undefined
      })
    })

    test('dont strip BA registry from qualifiers', () => {
      // regression test for https://github.com/CycloneDX/cyclonedx-javascript-library/issues/1073
      const component = new Component(ComponentType.Library, 'testing', {
        externalReferences: new ExternalReferenceRepository([
          new ExternalReference(
            'https://registry.npmjs.org.badactor.net/@cyclonedx/cyclonedx-library/-/cyclonedx-library-1.0.0-beta.2.tgz',
            ExternalReferenceType.Distribution
          )
        ])
      })
      const purlFac = new PackageUrlFactory('npm')
      const actual = purlFac.makeFromComponent(component)
      assert.deepEqual(actual,
        {
          type: 'npm',
          name: 'testing',
          namespace: undefined,
          version: undefined,
          qualifiers: {
            download_url: 'https://registry.npmjs.org.badactor.net/@cyclonedx/cyclonedx-library/-/cyclonedx-library-1.0.0-beta.2.tgz'
          },
          subpath: undefined
        })
    })
  })
})
