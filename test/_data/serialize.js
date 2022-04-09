const fs = require('fs')
const path = require('path')

const {PackageURL} = require("packageurl-js")

const {Enums, Models, Spec} = require('../../')

/**
 * @param {string} purpose
 * @param {Spec.Version} spec
 * @return {string}
 */
function serializeResults (purpose, spec) {
    return fs.readFileSync(
        path.resolve(__dirname, 'serializeResults', `${purpose}-spec${spec}.txt`)
    ).toString()
}

module.exports.serializeResults = serializeResults

/**
 * @return {Models.Bom}
 */
function createComplexStructure() {
    const bom = new Models.Bom()
    bom.version = 7
    bom.serialNumber = 'urn:uuid:12345678-1234-1234-1234-123456789012'
    bom.metadata.timestamp = new Date('2001-05-23T13:37:42.000Z')
    bom.metadata.tools.add((function (tool) {
        tool.vendor = 'tool vendor'
        tool.name = 'tool name'
        tool.version = '0.8.15'
        tool.hashes.set(Enums.HashAlgorithm.MD5, 'f32a26e2a3a8aa338cd77b6e1263c535')
        return tool
    })(new Models.Tool()))
    bom.metadata.authors.add((function (author) {
        author.name = 'Jane "the-author" Doe'
        author.email = 'cdx-author@mailinator.com'
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
        contact.email = 'cdx-supplier@mailinator.com'
        contact.pone = '555-0123456789'
        return contact
    })(new Models.OrganizationalContact()))
    bom.components.add((function (component) {
        component.bomRef.value = 'dummy-component'
        component.author = "component's author"
        component.copyright = '(c) acme'
        component.description = 'this is a test component'
        component.externalReferences.add((function (ref) {
            ref.comment = 'testing'
            return ref
        })(new Models.ExternalReference(new URL('https://localhost/acme'), Enums.ExternalReferenceType.Website)))
        component.group = 'acme'
        component.hashes.set(Enums.HashAlgorithm.SHA1, 'e6f36746ccba42c288acf906e636bb278eaeb7e8')
        component.licenses.add((function (license) {
            license.text = `Some\nlicense\ntext.`
            license.url = new URL('https://localhost/license')
            return license
        })(new Models.NamedLicense('some other')))
        component.licenses.add((function (license) {
            license.text = `MIT License\n...\nTHE SOFTWARE IS PROVIDED "AS IS"...`
            license.url = new URL('https://spdx.org/licenses/MIT.html')
            return license
        })(new Models.SpdxLicense('MIT')))
        component.licenses.add(new Models.LicenseExpression('MIT or other'))
        component.publisher = 'the publisher'
        component.purl = new PackageURL('npm', 'acme', 'dummy-component', '1337-beta')
        component.scope = Enums.ComponentScope.Required
        component.supplier = new Models.OrganizationalEntity()
        component.swid = new Models.SWID('some-tag', 'dummy-component')
        component.swid.version = '1337-beta'
        component.swid.path = true
        component.swid.text = new Models.Attachment('some context')
        component.swid.text.contentType = 'some context type'
        component.swid.text.encoding = Enums.AttachmentEncoding.Base64
        component.swid.url = new URL('https://localhost/swid')
        component.version = '1337-beta'
        return component
    })(new Models.Component(Enums.ComponentType.Library, 'dummy-component')))

    return bom
}
module.exports.createComplexStructure = createComplexStructure
