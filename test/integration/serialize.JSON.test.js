const JsonSerialize = require('../../').Serialize.JSON
const {Spec1_4} = require('../../').Serialize.Spec
const {Enums, Models} = require('../../')

const bom = new Models.Bom()
bom.version = 1337
bom.serialNumber = 'urn:uuid:12345678-1234-1234-1234-123456789012'
bom.metadata.timestamp = new Date('2001-05-23T13:37:42.000Z')
bom.metadata.tools.add((function(t){
    return t
})(new Models.Tool()))
bom.metadata.authors.add((function(a){
    return a
})(new Models.OrganizationalContact()))
bom.metadata.component = new Models.Component(Enums.ComponentType.Library, 'RootComponent')
bom.metadata.component.group = 'RootComponent group'
bom.metadata.manufacture = new Models.OrganizationalEntity()
bom.metadata.manufacture.name = 'meta manufacture'
bom.metadata.manufacture.url.add(new URL('https://meta-manufacture.xmpl'))
bom.metadata.supplier = new Models.OrganizationalEntity()
bom.metadata.supplier.name = 'meta supplier'
bom.metadata.supplier.url.add(new URL('https://meta-supplier.xmpl'))
bom.metadata.supplier.contact.add((function(c){
    return c
})(new Models.OrganizationalContact()))
bom.components.add((function(c){
    return c
})(new Models.Component(Enums.ComponentType.Library, 'Foo')))


const serializer = new JsonSerialize.Serializer(
    new JsonSerialize.Normalize.Factory(
        new Spec1_4()
    )
)
console.debug(
    bom,
    serializer.serialize(bom)
)

// todo: add the assertion
