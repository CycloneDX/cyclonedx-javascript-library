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

const jsonSerializer = new cdx.Serialize.JsonSerializer(
  new cdx.Serialize.JSON.Normalize.Factory(
    cdx.Spec.Spec1dot4))
const serialized = jsonSerializer.serialize(bom)
console.log(serialized)
