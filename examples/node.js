const CycloneDX_library = require('../')

let bom = new CycloneDX_library.models.Bom()
bom.components.add(
    new CycloneDX_library.models.Component(
        CycloneDX_library.enums.ComponentType.Library,
        'myComponent'
    )
)
