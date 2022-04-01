const cdx = require('../')

let bom = new cdx.models.Bom()
bom.components.add(
    new cdx.models.Component(cdx.enums.ComponentType.Library, 'myComponent'))
