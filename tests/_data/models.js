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

const { PackageURL } = require('packageurl-js')

const { Enums, Models } = require('../../')

/** @typedef {import('../../').Models.Bom} Bom */

/**
 * @returns {Bom}
 */
module.exports.createComplexStructure = function () {
  const bom = new Models.Bom({
    version: 7,
    serialNumber: 'urn:uuid:12345678-1234-1234-1234-123456789012',
    metadata: new Models.Metadata({
      timestamp: new Date('2001-05-23T13:37:42.000Z'),
      tools: new Models.ToolRepository([
        new Models.Tool({
          vendor: 'tool vendor',
          name: 'tool name',
          version: '0.8.15',
          hashes: new Models.HashRepository([
            [Enums.HashAlgorithm.MD5, 'f32a26e2a3a8aa338cd77b6e1263c535'],
            [Enums.HashAlgorithm['SHA-1'], '829c3804401b0727f70f73d4415e162400cbe57b']
          ])
        }),
        new Models.Tool({
          vendor: 'tool vendor',
          name: 'other tool',
          version: '', // empty string, not undefined
          externalReferences: new Models.ExternalReferenceRepository([
            new Models.ExternalReference(
              'https://cyclonedx.org/tool-center/',
              Enums.ExternalReferenceType.Website,
              { comment: 'the tools that made this' }
            )
          ])
        })
      ]),
      authors: new Models.OrganizationalContactRepository([
        new Models.OrganizationalContact({ name: 'John "the-co-author" Doe' }),
        new Models.OrganizationalContact({
          name: 'Jane "the-author" Doe',
          email: 'cdx-authors@mailinator.com',
          pone: '555-1234567890'
        })
      ]),
      component: new Models.Component(Enums.ComponentType.Library, 'Root Component', {
        bomRef: 'dummy.metadata.component'
      }),
      manufacture: new Models.OrganizationalEntity({
        name: 'meta manufacture',
        url: new Set([new URL('https://meta-manufacture.xmpl')])
      }),
      supplier: new Models.OrganizationalEntity({
        name: 'meta supplier',
        url: new Set([new URL('https://meta-supplier.xmpl')]),
        contact: new Models.OrganizationalContactRepository([
          new Models.OrganizationalContact({
            name: 'John "the-supplier" Doe',
            email: 'cdx-suppliers@mailinator.com',
            pone: '555-0123456789'
          }),
          new Models.OrganizationalContact({
            name: 'Jane "the-other-supplier" Doe'
          })
        ])
      })
    })
  })

  bom.components.add((function (component) {
    component.bomRef.value = 'dummy-component'
    component.author = 'component\'s author'
    component.cpe = 'cpe:2.3:a:microsoft:internet_explorer:8.0.6001:beta:*:*:*:*:*:*'
    component.copyright = '(c) acme'
    component.description = 'this is a test component'
    component.externalReferences.add(
      new Models.ExternalReference(new URL('https://localhost/acme'), Enums.ExternalReferenceType.Website, { comment: 'testing' }))
    component.externalReferences.add(new Models.ExternalReference(
      new URL('https://localhost/acme/support'),
      Enums.ExternalReferenceType.Support
    ))
    component.externalReferences.add(new Models.ExternalReference(
      './other/file',
      Enums.ExternalReferenceType.ReleaseNotes // available since spec 1.4
    ))
    component.group = 'acme'
    component.hashes.set(Enums.HashAlgorithm['SHA-1'], 'e6f36746ccba42c288acf906e636bb278eaeb7e8')
    component.hashes.set(Enums.HashAlgorithm.MD5, '6bd3ac6fb35bb07c3f74d7f72451af57')
    component.hashes.set(Enums.HashAlgorithm['SHA-256'], 'something-invalid-according-to-spec')
    component.licenses.add(new Models.NamedLicense('some other', {
      text: new Models.Attachment('U29tZQpsaWNlbnNlCnRleHQu', {
        contentType: 'text/plain',
        encoding: Enums.AttachmentEncoding.Base64
      }),
      url: 'https://localhost/license'
    }))
    component.licenses.add((function (license) {
      license.text = new Models.Attachment('TUlUIExpY2Vuc2UKLi4uClRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCAiQVMgSVMiLi4u')
      license.text.contentType = 'text/plain'
      license.text.encoding = Enums.AttachmentEncoding.Base64
      license.url = new URL('https://spdx.org/licenses/MIT.html')
      return license
    })(new Models.SpdxLicense('MIT')))
    component.licenses.add(new Models.LicenseExpression('(MIT or Apache-2.0)'))
    component.publisher = 'the publisher'
    component.purl = new PackageURL('npm', 'acme', 'dummy-component', '1337-beta')
    component.scope = Enums.ComponentScope.Required
    component.supplier = new Models.OrganizationalEntity({ name: 'Component Supplier' })
    component.supplier.url.add(new URL('https://localhost/componentSupplier-B'))
    component.supplier.url.add('https://localhost/componentSupplier-A')
    component.supplier.contact.add(new Models.OrganizationalContact({ name: 'The quick brown fox' }))
    component.supplier.contact.add((function (contact) {
      contact.name = 'Franz'
      contact.email = 'franz-aus-bayern@komplett.verwahrlosten.taxi'
      contact.phone = '555-732378879'
      return contact
    })(new Models.OrganizationalContact()))
    component.swid = new Models.SWID('some-tag', 'dummy-component', {
      version: '1337-beta',
      patch: true,
      text: new Models.Attachment('some context')
    })
    component.swid.text.contentType = 'some context type'
    component.swid.text.encoding = Enums.AttachmentEncoding.Base64
    component.swid.url = new URL('https://localhost/swid')

    bom.metadata.component.dependencies.add(component.bomRef)

    return component
  })(new Models.Component(Enums.ComponentType.Library, 'dummy-component', { version: '1337-beta' })))

  bom.components.add((function (component) {
    // interlink everywhere
    bom.metadata.component.dependencies.add(component.bomRef)
    bom.components.forEach(c => c.dependencies.add(component.bomRef))
    return component
  })(new Models.Component(Enums.ComponentType.Library, 'a-component', {
    bomRef: 'a-component',
    version: '', // empty string - not undefined
    dependencies: new Models.BomRefRepository([
      new Models.BomRef('unknown foreign ref that should not be rendered')
    ])
  })))

  bom.components.add((function (component) {
    // scenario:
    // * `subComponentA` is a bundled dependency, that itself depends on `subComponentB`.
    // * `subComponentB` is a transitive bundled dependency.
    const subComponentA = new Models.Component(Enums.ComponentType.Library, 'SubComponentA', {
      bomRef: `${component.bomRef.value}#SubComponentA`
    })
    component.dependencies.add(subComponentA.bomRef)
    component.components.add(subComponentA)
    const subComponentB = new Models.Component(Enums.ComponentType.Library, 'SubComponentB', {
      bomRef: `${component.bomRef.value}#SubComponentB`
    })
    subComponentA.dependencies.add(subComponentB.bomRef)
    component.components.add(subComponentB)

    bom.metadata.component.dependencies.add(component.bomRef)

    return component
  })(new Models.Component(
    Enums.ComponentType.Framework, 'SomeFrameworkBundle', {
      bomRef: 'SomeFrameworkBundle'
    })))

  return bom
}
