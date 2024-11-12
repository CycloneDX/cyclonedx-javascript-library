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

const { Enums, Models, Types } = require('../../')

/**
 * @returns {Models.Bom}
 */
module.exports.createComplexStructure = function () {
  const bomSerialNumberRaw = 'ac35b126-ef3a-11ed-a05b-0242ac120003'
  const bom = new Models.Bom({
    version: 7,
    serialNumber: `urn:uuid:${bomSerialNumberRaw}`,
    metadata: new Models.Metadata({
      timestamp: new Date('2032-05-23T13:37:42Z'),
      lifecycles: new Models.LifecycleRepository([
        Enums.LifecyclePhase.Design,
        new Models.NamedLifecycle('testing', { description: 'my testing stage' })
      ]),
      tools: new Models.ToolRepository([
        new Models.Tool({
          vendor: 'tool vendor',
          name: 'tool name',
          version: '0.8.15',
          hashes: new Models.HashDictionary([
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
          phone: '555-1234567890'
        })
      ]),
      component: new Models.Component(Enums.ComponentType.Library, 'Root Component', {
        bomRef: 'dummy.metadata.component',
        version: '1.33.7'
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
            phone: '555-0123456789'
          }),
          new Models.OrganizationalContact({
            name: 'Jane "the-other-supplier" Doe'
          })
        ])
      }),
      licenses: new Models.LicenseRepository([
        new Models.SpdxLicense('0BSD'),
        new Models.NamedLicense('Some license name')
      ]),
      properties: new Models.PropertyRepository([
        new Models.Property('a', 'b'),
        new Models.Property('cdx:reproducible', 'true')
      ])
    })
  })

  bom.components.add((function (component) {
    component.bomRef.value = 'dummy-component'
    component.author = 'component\'s author'
    component.cpe = 'cpe:2.3:a:microsoft:internet_explorer:8.0.6001:beta:*:*:*:*:*:*'
    component.copyright = 'ACME corp'
    component.description = 'this is a test component'
    component.externalReferences.add(
      new Models.ExternalReference(new URL('https://localhost/acme'), Enums.ExternalReferenceType.Website, { comment: 'testing' }))
    component.externalReferences.add(new Models.ExternalReference(
      new URL('https://localhost/acme/support'),
      Enums.ExternalReferenceType.Support
    ))
    component.externalReferences.add(new Models.ExternalReference(
      'https://localhost/download/acme.tar.gz',
      Enums.ExternalReferenceType.Distribution,
      {
        hashes: new Models.HashDictionary([
          [Enums.HashAlgorithm.MD5, '327b6f07435811239bc47e1544353273'],
          [Enums.HashAlgorithm['SHA-1'], 'd53a205a336e07cf9eac45471b3870f9489288ec'],
          [Enums.HashAlgorithm['SHA-256'], '1f2ec52b774368781bed1d1fb140a92e0eb6348090619c9291f9a5a3c8e8d151']
        ])
      }
    ))
    component.externalReferences.add(new Models.ExternalReference(
      'git+https://localhost/acme.git',
      Enums.ExternalReferenceType.VCS
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
      license.acknowledgement = Enums.LicenseAcknowledgement.Declared
      return license
    })(new Models.SpdxLicense('MIT')))
    component.publisher = 'the publisher'
    component.purl = new PackageURL('npm', 'acme', 'dummy-component', '1337-beta', undefined, undefined)
    component.scope = Enums.ComponentScope.Required
    component.supplier = new Models.OrganizationalEntity({ name: 'Component Supplier' })
    component.supplier.url.add(new URL('https://localhost/componentSupplier-B'))
    component.supplier.url.add('https://localhost/componentSupplier-A')
    component.supplier.contact.add(new Models.OrganizationalContact({ name: 'The quick brown fox' }))
    component.supplier.contact.add((function (contact) {
      contact.name = 'Franz'
      contact.email = 'franz-aus-bayern@komplett.verwahrlostes.taxi'
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

    component.evidence = new Models.ComponentEvidence()
    component.evidence.licenses.add((function (license) {
      license.text = new Models.Attachment(
        'VEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIOKAnEFTIElT4oCdLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS4='
      )
      license.text.contentType = 'text/plain'
      license.text.encoding = Enums.AttachmentEncoding.Base64
      return license
    })(new Models.NamedLicense('License.txt')))
    component.evidence.copyright.add('Copyright © 2023 ACME corp')

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

  bom.components.add(new Models.Component(
    Enums.ComponentType.Library, 'component-with-properties', {
      bomRef: 'ComponentWithProperties',
      properties: new Models.PropertyRepository([
        new Models.Property('internal:testing:prop-Z', 'value Z'),
        new Models.Property('internal:testing:prop-Z', 'value B'),
        new Models.Property('internal:testing:prop-A', 'value A')
      ])
    }))

  bom.components.add(
    new Models.Component(
      Enums.ComponentType.Library, 'component-with-licenses', {
        bomRef: 'component-with-licenses',
        licenses: new Models.LicenseRepository([
          new Models.NamedLicense('something'),
          new Models.SpdxLicense('MIT'),
          new Models.SpdxLicense('Apache-2.0'),
          new Models.SpdxLicense('unknown SPDX license', { url: 'https://acme.com/license' })
          // no expression
        ])
      }
    )
  )
  bom.components.add(
    new Models.Component(
      Enums.ComponentType.Library, 'component-with-licenseExpression', {
        bomRef: 'component-with-licenseExpression',
        licenses: new Models.LicenseRepository([
          new Models.LicenseExpression('(MIT OR Apache-2.0)')
          // no named nor SPDX
        ])
      }
    )
  )
  bom.components.add(
    /* scenario: prefer any expression over other licenses */
    new Models.Component(
      Enums.ComponentType.Library, 'component-with-licenses-and-expression', {
        bomRef: 'component-with-licenses-and-expression',
        licenses: new Models.LicenseRepository([
          new Models.NamedLicense('something'),
          new Models.SpdxLicense('MIT'),
          new Models.SpdxLicense('Apache-2.0'),
          new Models.LicenseExpression('(MIT OR Apache-2.0)')
        ])
      }
    )
  )

  bom.components.add(
    new Models.Component(
      Enums.ComponentType.Library, 'component-with-unescaped-urls', {
        bomRef: 'component-with-unescaped-urls',
        externalReferences: new Models.ExternalReferenceRepository(
          [
            ['encode anyUri: urn', 'urn:example:org'],
            ['encode anyUri: https', 'https://example.org/p?k=v#f'],
            ['encode anyUri: mailto', 'mailto:info@example.org'],
            ['encode anyUri: relative path', '../foo/bar'],
            ['encode anyUri: space', 'https://example.org/foo bar bazz%20again+again'],
            ['encode anyUri: quotation', `https://example.org/this"test"isa'test'`],
            ['encode anyUri: []', 'https://example.org/?bar[test]=baz[again]'],
            ['encode anyUri: <>', 'https://example.org/#<test><again>'],
            ['encode anyUri: {}', 'https://example.org/#{test}{again}'],
            ['encode anyUri: non-ASCII', 'https://example.org/édition'],
            ['encode anyUri: partially encoded', 'https://example.org/?bar[test%5D=baz%5bagain]']
          ].map(
            ([desc, uri]) => new Models.ExternalReference(
              uri, Enums.ExternalReferenceType.Other, {
                comment: desc
              }
            )
          )
        )
      }
    )
  )

  bom.services.add((function (service) {
    service.bomRef.value = 'some-service'
    service.provider = new Models.OrganizationalEntity({ name: 'Service Provider' })
    service.group = 'acme'
    service.version = '1.2+service-version'
    service.description = 'this is a test service'
    service.externalReferences.add(new Models.ExternalReference(
      'https://localhost/service/docs',
      Enums.ExternalReferenceType.Documentation
    ))
    service.licenses.add(new Models.NamedLicense('some license', {
      text: new Models.Attachment('U29tZQpsaWNlbnNlCnRleHQu', {
        contentType: 'text/plain',
        encoding: Enums.AttachmentEncoding.Base64
      }),
      url: 'https://localhost/service/license'
    }))
    service.properties.add(new Models.Property('foo', 'bar'))

    bom.metadata.component.dependencies.add(service.bomRef)

    return service
  })(new Models.Service('dummy-service', { version: '1.0+service-version' })))

  bom.services.add((function (service) {
    service.bomRef.value = 'my-service'

    const s2 = new Models.Service('sub-service')
    s2.bomRef.value = 'my-service/sub-service'
    service.services.add(s2)

    const s3 = new Models.Service('nested-service')
    s3.bomRef.value = 'my-service/nested-service'
    service.services.add(s3)

    bom.metadata.component.dependencies.add(service.bomRef)

    return service
  })(new Models.Service('dummy-service-2')))

  const someVulnerableComponent = new Models.Component(
    Enums.ComponentType.Library,
    'component-with-vulnerabilities',
    {
      bomRef: 'component-with-vulnerabilities',
      version: '1.0'
    }
  )
  bom.components.add(someVulnerableComponent)

  bom.vulnerabilities.add(
    /* scenario: https://cyclonedx.org/use-cases/#known-vulnerabilities */
    new Models.Vulnerability.Vulnerability({
      bomRef: 'vulnerability-1',
      id: 'CVE-2018-7489',
      source: new Models.Vulnerability.Source({
        name: 'NVD',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2019-9997'
      }),
      ratings: new Models.Vulnerability.RatingRepository([
        new Models.Vulnerability.Rating({
          source: new Models.Vulnerability.Source({
            name: 'NVD',
            url: 'https://nvd.nist.gov/vuln-metrics/cvss/v3-calculator?vector=AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H&version=3.0'
          }),
          score: 9.8,
          severity: Enums.Vulnerability.Severity.Critical,
          method: 'CVSSv3',
          vector: 'AN/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'
        })
      ]),
      cwes: new Types.CweRepository([
        502,
        184
      ]),
      description: 'FasterXML jackson-databind before 2.7.9.3, 2.8.x before 2.8.11.1 and 2.9.x before 2.9.5 allows unauthenticated remote code execution because of an incomplete fix for the CVE-2017-7525 deserialization flaw. This is exploitable by sending maliciously crafted JSON input to the readValue method of the ObjectMapper, bypassing a blacklist that is ineffective if the c3p0 libraries are available in the classpath.',
      recommendation: 'Upgrade com.fasterxml.jackson.core:jackson-databind to version 2.6.7.5, 2.8.11.1, 2.9.5 or higher.',
      advisories: new Models.Vulnerability.AdvisoryRepository([
        new Models.Vulnerability.Advisory(
          'https://github.com/FasterXML/jackson-databind/commit/6799f8f10cc78e9af6d443ed6982d00a13f2e7d2',
          { title: 'GitHub Commit' }
        ),
        new Models.Vulnerability.Advisory(
          new URL('https://github.com/FasterXML/jackson-databind/issues/1931'),
          { title: 'GitHub Issue' }
        )
      ]),
      created: new Date('2021-08-15T23:42:00Z'),
      published: new Date('2022-01-01T00:00:00Z'),
      updated: new Date('2023-01-01T00:00:00Z'),
      analysis: new Models.Vulnerability.Analysis({
        state: Enums.Vulnerability.AnalysisState.NotAffected,
        justification: Enums.Vulnerability.AnalysisJustification.CodeNotReachable,
        response: new Enums.Vulnerability.AnalysisResponseRepository([
          Enums.Vulnerability.AnalysisResponse.WillNotFix,
          Enums.Vulnerability.AnalysisResponse.Update
        ]),
        detail: 'An optional explanation of why the application is not affected by the vulnerable component.'
      }),
      affects: new Models.Vulnerability.AffectRepository([
        new Models.Vulnerability.Affect(
          new Models.BomRef('urn:cdx:3e671687-395b-41f5-a30f-a58921a69b79/1#jackson-databind-2.8.0')
        )
      ])
    })
  )

  bom.vulnerabilities.add(
    /* scenario: complete model affecting some component */
    new Models.Vulnerability.Vulnerability({
      bomRef: 'dummy.vulnerability.1',
      id: '1',
      source: new Models.Vulnerability.Source({ name: 'manual' }),
      references: new Models.Vulnerability.ReferenceRepository([
        new Models.Vulnerability.Reference(
          'CVE-2042-42421',
          new Models.Vulnerability.Source({ url: 'https://nvd.nist.gov/vuln/detail/CVE-2022-42421' })),
        new Models.Vulnerability.Reference(
          'CVE-2042-42420',
          new Models.Vulnerability.Source({ url: 'https://nvd.nist.gov/vuln/detail/CVE-2022-42420' }))
      ]),
      ratings: new Models.Vulnerability.RatingRepository([
        new Models.Vulnerability.Rating({
          score: 10,
          method: Enums.Vulnerability.RatingMethod.Other,
          severity: Enums.Vulnerability.Severity.Critical,
          justification: 'this is crazy'
        })
      ]),
      cwes: new Types.CweRepository([142, 42]),
      advisories: new Models.Vulnerability.AdvisoryRepository([
        new Models.Vulnerability.Advisory('https://www.advisories.com/', { title: 'vulnerability 1 discovered' })
      ]),
      description: 'description of 1',
      detail: 'detail of 1',
      recommendation: 'recommendation of 1',
      created: new Date('2023-03-03T00:00:40.000Z'),
      published: new Date('2023-03-03T00:00:41.000Z'),
      updated: new Date('2023-03-03T00:00:42.000Z'),
      credits: new Models.Vulnerability.Credits({
        organizations: new Models.OrganizationalEntityRepository([
          new Models.OrganizationalEntity({
            name: 'vulnerability researchers inc.',
            url: new Set([new URL('https://vulnerabilities-researchers.com')])
          })
        ]),
        individuals: new Models.OrganizationalContactRepository([
          new Models.OrganizationalContact({ name: 'John "pentester" Doe' })
        ])
      }),
      tools: new Models.ToolRepository([
        new Models.Tool({
          vendor: 'v the vendor',
          name: 'tool name'
        })
      ]),
      analysis: new Models.Vulnerability.Analysis({
        state: Enums.Vulnerability.AnalysisState.FalsePositive,
        justification: Enums.Vulnerability.AnalysisJustification.ProtectedAtRuntime,
        response: new Enums.Vulnerability.AnalysisResponseRepository([
          Enums.Vulnerability.AnalysisResponse.CanNotFix,
          Enums.Vulnerability.AnalysisResponse.WillNotFix
        ]),
        detail: 'analysis details'
      }),
      affects: new Models.Vulnerability.AffectRepository([
        new Models.Vulnerability.Affect(
          new Models.BomRef(`urn:cdx:${bomSerialNumberRaw}/${bom.version}#${someVulnerableComponent.bomRef.value}`),
          {
            versions: new Models.Vulnerability.AffectedVersionRepository([
              new Models.Vulnerability.AffectedSingleVersion('1.0.0', {
                status: Enums.Vulnerability.AffectStatus.Affected
              }),
              new Models.Vulnerability.AffectedVersionRange('> 1.0', {
                status: Enums.Vulnerability.AffectStatus.Unknown
              })
            ])
          }),
        new Models.Vulnerability.Affect(
          someVulnerableComponent.bomRef,
          {
            versions: new Models.Vulnerability.AffectedVersionRepository([
              new Models.Vulnerability.AffectedSingleVersion('1.0.0', {
                status: Enums.Vulnerability.AffectStatus.Affected
              })
            ])
          })
      ]),
      properties: new Models.PropertyRepository([
        new Models.Property('a name', 'a value')
      ])
    }))
  bom.vulnerabilities.add(
    /* scenario: complete model affecting own rootComponent */
    new Models.Vulnerability.Vulnerability({
      bomRef: 'dummy.vulnerability.2',
      id: '2',
      source: new Models.Vulnerability.Source({ name: 'manual' }),
      references: new Models.Vulnerability.ReferenceRepository([
        new Models.Vulnerability.Reference(
          'CVE-2042-42422',
          new Models.Vulnerability.Source({
            url: 'https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-42422'
          }))
      ]),
      ratings: new Models.Vulnerability.RatingRepository([
        new Models.Vulnerability.Rating({
          score: 10,
          method: Enums.Vulnerability.RatingMethod.Other,
          severity: Enums.Vulnerability.Severity.Critical,
          justification: 'this is crazy'
        })
      ]),
      cwes: new Types.CweRepository([242]),
      advisories: new Models.Vulnerability.AdvisoryRepository([
        new Models.Vulnerability.Advisory('https://www.advisories.com/', { title: 'vulnerability 2 discovered' })
      ]),
      description: 'description of 2',
      detail: 'detail of 2',
      recommendation: 'recommendation of 2',
      created: new Date('2023-03-03T00:00:40.000Z'),
      published: new Date('2023-03-03T00:00:41.000Z'),
      updated: new Date('2023-03-03T00:00:42.000Z'),
      credits: new Models.Vulnerability.Credits({
        organizations: new Models.OrganizationalEntityRepository([
          new Models.OrganizationalEntity({
            name: 'vulnerability researchers inc.',
            url: new Set([new URL('https://vulnerabilities-researchers.com')])
          })
        ]),
        individuals: new Models.OrganizationalContactRepository([
          new Models.OrganizationalContact({ name: 'John "pentester" Doe' })
        ])
      }),
      tools: new Models.ToolRepository([
        new Models.Tool({
          vendor: 'v the vendor',
          name: 'tool name'
        })
      ]),
      analysis: new Models.Vulnerability.Analysis({
        state: Enums.Vulnerability.AnalysisState.FalsePositive,
        justification: Enums.Vulnerability.AnalysisJustification.ProtectedAtRuntime,
        response: new Enums.Vulnerability.AnalysisResponseRepository([
          Enums.Vulnerability.AnalysisResponse.CanNotFix,
          Enums.Vulnerability.AnalysisResponse.WillNotFix
        ]),
        detail: 'analysis details'
      }),
      affects: new Models.Vulnerability.AffectRepository([
        new Models.Vulnerability.Affect(
          new Models.BomRef(`urn:cdx:${bomSerialNumberRaw}/${bom.version}#${bom.metadata.component.bomRef.value}`),
          {
            versions: new Models.Vulnerability.AffectedVersionRepository([
              new Models.Vulnerability.AffectedSingleVersion('1.0.0', {
                status: Enums.Vulnerability.AffectStatus.Affected
              }),
              new Models.Vulnerability.AffectedVersionRange('> 1.0', {
                status: Enums.Vulnerability.AffectStatus.Unknown
              })
            ])
          }),
        new Models.Vulnerability.Affect(
          bom.metadata.component.bomRef,
          {
            versions: new Models.Vulnerability.AffectedVersionRepository([
              new Models.Vulnerability.AffectedSingleVersion('1.0.0', {
                status: Enums.Vulnerability.AffectStatus.Affected
              })
            ])
          })
      ]),
      properties: new Models.PropertyRepository([
        new Models.Property('a name', 'a value')
      ])
    }))

  return bom
}
