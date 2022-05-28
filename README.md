# CycloneDX JavaScript library

Core functionality of [CycloneDX] for _JavaScript_ (node or web-browser),
written in _TypeScript_ and compiled to the target.

## Install

This package and the build results are available for npm and yarn:

```shell
npm i -S @cyclonedx/cyclonedx-library
yarn add @cyclonedx/cyclonedx-library
```

You can install the package from source,
which will build automatically on installation:

```shell
npm i -S github:CycloneDX/cyclonedx-javascript-library
# not supported with yarn
```

## Usage

### As node package

```javascript
const cdx = require('@cyclonedx/cyclonedx-library')

const bom = new cdx.Models.Bom()
bom.components.add(
  new cdx.Models.Component(
    cdx.Enums.ComponentType.Library,
    'myComponent'
  )
)
```

### In web-browser

```html
<script src="path-to-this-package/dist.web/lib.js">
    // full Library is available as `CycloneDX_library`, per default
</script>
<script type="application/javascript">
    const cdx = CycloneDX_library

    let bom = new cdx.Models.Bom()
    bom.components.add(
            new cdx.Models.Component(
                    cdx.Enums.ComponentType.Library,
                    'myComponent'
            )
    )
</script>
```

## Development & Contributing

See [CONTRIBUTING] file for details.

[CycloneDX]: https://cyclonedx.org/
[CONTRIBUTING]: https://github.com/CycloneDX/cyclonedx-javascript-library/blob/1.0-dev/CONTRIBUTING.md
