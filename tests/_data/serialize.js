const fs = require('fs')
const path = require('path')

const { PackageURL } = require('packageurl-js')

const { Enums, Models } = require('../../')

/** @typedef {import('../../').Spec.Version} Version */

/** @typedef {import('../../').Models.Bom} Bom */

/**
 * @param {string} purpose
 * @param {Version} spec
 * @param {string} format
 * @param {BufferEncoding} [encoding]
 * @returns {string}
 */
module.exports.loadSerializeResult = function (purpose, spec, format, encoding = 'utf-8') {
  return fs.readFileSync(
    path.resolve(__dirname, 'serializeResults', `${purpose}_spec${spec}.${format}`)
  ).toString(encoding)
}

/**
 * @param {string} data
 * @param {string} purpose
 * @param {Version} spec
 * @param {string} format
 */
module.exports.writeSerializeResult = function (data, purpose, spec, format) {
  return fs.writeFileSync(
    path.resolve(__dirname, 'serializeResults', `${purpose}_spec${spec}.${format}`),
    data
  )
}

/**
 * @returns {Bom}
 */
module.exports.createComplexStructure = function () {
  const bom = new Models.Bom()

  bom.version = 7
  bom.serialNumber = 'urn:uuid:12345678-1234-1234-1234-123456789012'
  bom.metadata.timestamp = new Date('2001-05-23T13:37:42.000Z')
  bom.metadata.tools.add((function (tool) {
    tool.vendor = 'tool vendor'
    tool.name = 'tool name'
    tool.version = '0.8.15'
    tool.hashes.set(Enums.HashAlgorithm.MD5, 'f32a26e2a3a8aa338cd77b6e1263c535')
    tool.hashes.set(Enums.HashAlgorithm['SHA-1'], '829c3804401b0727f70f73d4415e162400cbe57b')
    return tool
  })(new Models.Tool()))
  bom.metadata.tools.add((function (tool) {
    tool.vendor = 'tool vendor'
    tool.name = 'other tool'
    return tool
  })(new Models.Tool()))
  bom.metadata.authors.add((function (author) {
    author.name = 'John "the-co-author" Doe'
    return author
  })(new Models.OrganizationalContact()))
  bom.metadata.authors.add((function (author) {
    author.name = 'Jane "the-author" Doe'
    author.email = 'cdx-authors@mailinator.com'
    author.pone = '555-1234567890'
    return author
  })(new Models.OrganizationalContact()))
  bom.metadata.component = new Models.Component(Enums.ComponentType.Library, 'Root Component')
  bom.metadata.component.bomRef.value = 'dummy.metadata.component'
  bom.metadata.manufacture = new Models.OrganizationalEntity()
  bom.metadata.manufacture.name = 'meta manufacture'
  bom.metadata.manufacture.url.add(new URL('https://meta-manufacture.xmpl'))
  bom.metadata.supplier = new Models.OrganizationalEntity()
  bom.metadata.supplier.name = 'meta supplier'
  bom.metadata.supplier.url.add(new URL('https://meta-supplier.xmpl'))
  bom.metadata.supplier.contact.add((function (contact) {
    contact.name = 'John "the-supplier" Doe'
    contact.email = 'cdx-suppliers@mailinator.com'
    contact.pone = '555-0123456789'
    return contact
  })(new Models.OrganizationalContact()))
  bom.metadata.supplier.contact.add((function (contact) {
    contact.name = 'Jane "the-other-supplier" Doe'
    return contact
  })(new Models.OrganizationalContact()))
  bom.components.add((function (component) {
    component.bomRef.value = 'dummy-component'
    component.author = 'component\'s author'
    component.cpe = 'cpe:2.3:a:microsoft:internet_explorer:8.0.6001:beta:*:*:*:*:*:*'
    component.copyright = '(c) acme'
    component.description = 'this is a test component'
    component.externalReferences.add((function (ref) {
      ref.comment = 'testing'
      return ref
    })(new Models.ExternalReference(new URL('https://localhost/acme'), Enums.ExternalReferenceType.Website)))
    component.externalReferences.add(new Models.ExternalReference(
      new URL('https://localhost/acme/support'),
      Enums.ExternalReferenceType.Support
    ))
    component.externalReferences.add(new Models.ExternalReference(
      new URL('https://localhost/acme/releases'),
      Enums.ExternalReferenceType.ReleaseNotes // available since spec 1.4
    ))
    component.group = 'acme'
    component.hashes.set(Enums.HashAlgorithm['SHA-1'], 'e6f36746ccba42c288acf906e636bb278eaeb7e8')
    component.hashes.set(Enums.HashAlgorithm.MD5, '6bd3ac6fb35bb07c3f74d7f72451af57')
    component.hashes.set(Enums.HashAlgorithm.MD5, '6bd3ac6fb35bb07c3f74d7f72451af57')
    component.licenses.add((function (license) {
      license.text = new Models.Attachment('U29tZQpsaWNlbnNlCnRleHQu')
      license.text.contentType = 'text/plain'
      license.text.encoding = Enums.AttachmentEncoding.Base64
      license.url = new URL('https://localhost/license')
      return license
    })(new Models.NamedLicense('some other')))
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
    component.supplier = new Models.OrganizationalEntity()
    component.supplier.name = 'Component Supplier'
    component.supplier.url.add(new URL('https://localhost/componentSupplier-B'))
    component.supplier.url.add(new URL('https://localhost/componentSupplier-A'))
    component.supplier.contact.add((function (contact) {
      contact.name = 'The quick brown fox'
      return contact
    })(new Models.OrganizationalContact()))
    component.supplier.contact.add((function (contact) {
      contact.name = 'Franz'
      contact.email = 'franz-aus-bayern@komplett.verwahrlosten.taxi'
      contact.phone = '555-732378879'
      return contact
    })(new Models.OrganizationalContact()))
    component.swid = new Models.SWID('some-tag', 'dummy-component')
    component.swid.version = '1337-beta'
    component.swid.patch = true
    component.swid.text = new Models.Attachment('some context')
    component.swid.text.contentType = 'some context type'
    component.swid.text.encoding = Enums.AttachmentEncoding.Base64
    component.swid.url = new URL('https://localhost/swid')
    component.version = '1337-beta'

    bom.metadata.component.dependencies.add(component.bomRef)

    return component
  })(new Models.Component(Enums.ComponentType.Library, 'dummy-component')))
  bom.components.add(function (component) {
    component.bomRef.value = 'a-component'
    component.dependencies.add(new Models.BomRef('unknown foreign ref that should not be rendered'))

    bom.metadata.component.dependencies.add(component.bomRef)
    bom.components.forEach(c => c.dependencies.add(component.bomRef))

    return component
  }(new Models.Component(Enums.ComponentType.Library, 'a-component')))

  return bom
}
