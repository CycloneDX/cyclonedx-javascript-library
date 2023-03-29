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
  Enums,
  Models,
  Factories,
  Builders: { FromNodePackageJson: { ComponentBuilder } }
} = require('../../')

suite('Builders.FromNodePackageJson.ComponentBuilder', () => {
  const salt = Math.random()

  const extRefFactory = new Factories.FromNodePackageJson.ExternalReferenceFactory()
  extRefFactory.makeExternalReferences = () => [`FAKE REFERENCES ${salt}`]
  const licenseFactory = new Factories.LicenseFactory()
  licenseFactory.makeFromString = (s) => ({ name: `FAKE LICENSE: ${s}` })
  licenseFactory.makeDisjunctive = (s) => ({ name: `FAKE DISJUNCTIVE LICENSE: ${s}` })

  const sut = new ComponentBuilder(extRefFactory, licenseFactory);

  [
    [
      'minimal',
      { name: 'foo_bar' },
      new Models.Component(Enums.ComponentType.Library, 'foo_bar',
        { externalReferences: new Models.ExternalReferenceRepository([`FAKE REFERENCES ${salt}`]) })
    ],
    [
      'full',
      {
        name: '@foo/bar',
        version: `1.33.7-alpha.23.${salt}`,
        description: `dummy lib ${salt}`,
        author: {
          name: 'Jane Doe',
          url: 'https://acme.org/~jd'
        },
        license: `dummy license ${salt}`,
        licenses: [
          {
            type: `some license ${salt}`,
            url: `https://acme.org/license/${salt}`
          }
        ]
        // to be continued
      },
      new Models.Component(
        Enums.ComponentType.Library,
        'bar',
        {
          author: 'Jane Doe',
          description: `dummy lib ${salt}`,
          externalReferences: new Models.ExternalReferenceRepository([`FAKE REFERENCES ${salt}`]),
          licenses: new Models.LicenseRepository([
            { name: `FAKE LICENSE: dummy license ${salt}` },
            { name: `FAKE DISJUNCTIVE LICENSE: some license ${salt}`, url: `https://acme.org/license/${salt}` }
          ]),
          group: '@foo',
          version: `1.33.7-alpha.23.${salt}`
        }
      )
    ],
    [
      // Even though https://npmjs.org does not allow it,
      // there is nothing wrong with a package name that contains more than one slash(/).
      // It is completely compliant to NodeJS rules and will be properly resolved.
      'name with slashes',
      { name: '@foo/bar/baz' },
      new Models.Component(
        Enums.ComponentType.Library,
        'bar/baz',
        {
          group: '@foo',
          externalReferences: new Models.ExternalReferenceRepository([`FAKE REFERENCES ${salt}`])
        }
      )
    ]
  ].forEach(([purpose, data, expected]) => {
    test(`makeComponent: ${purpose}`, () => {
      const actual = sut.makeComponent(data)
      assert.deepStrictEqual(actual, expected)
    })
  })
})
