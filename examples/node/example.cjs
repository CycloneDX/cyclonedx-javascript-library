/** Example how to serialize a Bom to JSON. */

const cdx = require('@cyclonedx/cyclonedx-library')
// full Library is available as `cdx`, now

const bom = new cdx.Models.Bom()
bom.components.add(
  new cdx.Models.Component(
    cdx.Enums.ComponentType.Library,
    'myComponent'
  )
)

const serializer = new cdx.Serialize.JsonSerializer(
  new cdx.Serialize.JSON.Normalize.Factory(
    cdx.Spec.Spec1dot4))
const serialized = serializer.serialize(bom)
console.log(serialized)

const XmlSerializer = new cdx.Serialize.XmlSerializer(
  new cdx.Serialize.Xml.Normalize.Factory(
    cdx.Spec.Spec1dot4))
const serializedXml = XmlSerializer.serialize(bom)
console.log(serializedXml)
