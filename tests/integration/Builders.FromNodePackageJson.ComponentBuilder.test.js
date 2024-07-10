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
  const licenseFactory = new Factories.LicenseFactory()

  const sut = new ComponentBuilder(extRefFactory, licenseFactory);

  [
    [
      'minimal',
      { name: 'foo_bar' },
      new Models.Component(Enums.ComponentType.Library, 'foo_bar')
    ],
    [
      'full',
      {
        name: '@foo/bar',
        version: `1.33.7-alpha.23.${salt}`,
        description: `dummy lib ${salt}`,
        author: {
          name: 'Jane Doe',
          url: 'https://example.com/~jd'
        },
        license: `dummy license ${salt}`,
        licenses: [
          {
            type: `some license ${salt}`,
            url: `https://example.com/license/${salt}`
          }
        ],
        repository: {
          type: "git",
          url: "https://github.com/foo/bar.git"
        }
        // to be continued
      },
      new Models.Component(
        Enums.ComponentType.Library,
        'bar',
        {
          author: 'Jane Doe',
          description: `dummy lib ${salt}`,
          externalReferences: new Models.ExternalReferenceRepository([
            new Models.ExternalReference(
              'https://github.com/foo/bar.git',
              Enums.ExternalReferenceType.VCS,
              {
                comment: 'as detected from PackageJson property "repository.url"'
              }
            )
          ]),
          group: '@foo',
          licenses: new Models.LicenseRepository([
            new Models.NamedLicense(`dummy license ${salt}`),
            new Models.NamedLicense(`some license ${salt}`),
          ]),
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
        { group: '@foo' }
      )
    ],
    [
      // regression for https://github.com/CycloneDX/cyclonedx-javascript-library/issues/1119
      'with-implicit-git-ssh',
      {
        name: 'with-implicit-git-ssh',
        repository: {
          type: "git",
          url: "git@gitlab.example.com:my-project/some-repo.git"
        }
      },
      new Models.Component(
        Enums.ComponentType.Library,
        'with-implicit-git-ssh',
        {
          externalReferences: new Models.ExternalReferenceRepository([
            new Models.ExternalReference(
              'git+ssh://git@gitlab.example.com/my-project/some-repo.git',
              Enums.ExternalReferenceType.VCS,
              {
                comment: 'as detected from PackageJson property "repository.url"'
              }
            )
          ])
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
