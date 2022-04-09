const assert = require('assert');
const {describe, beforeEach, afterEach, it} = require('mocha');

const JsonSerialize = require('../../').Serialize.JSON
const {Spec} = require('../../')
const {Enums, Models} = require('../../')

describe('JSON serialize', () => {

    function createComplex() {
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
            return component
        })(new Models.Component(Enums.ComponentType.Library, 'Foo')))

        return bom
    }

    [
        Spec.Spec1_4,
        // TODO add other versions
    ].forEach(spec => describe(`complex with spec v${spec.version}`, () => {
            const serializer = new JsonSerialize.Serializer(
                new JsonSerialize.Normalize.Factory(spec)
            )

            beforeEach(function () {
                this.bom = createComplex()
            })

            afterEach(function () {
                delete this.bom
            })

            it('can serialize', function () {
                const serialized = serializer.serialize(this.bom)

                assert.strictEqual(typeof serialized, 'string')
            })

            // TODO add more tests
        })
    )
})
