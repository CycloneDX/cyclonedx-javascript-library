/** Example how to serialize a Bom to JSON. */

import * as  cdx from '../dist.node/index.js'
// full Library is available as `cdx`, now

const bom = new cdx.Models.Bom()
bom.components.add(
    new cdx.Models.Component(
        cdx.Enums.ComponentType.Library,
        'myComponent'
    )
)

const serializer = new cdx.Serialize.JSON.Serializer(
    new cdx.Serialize.JSON.Normalize.Factory(
        cdx.Spec.Spec1_4))
const serialized = serializer.serialize(bom)

console.log(serialized)
