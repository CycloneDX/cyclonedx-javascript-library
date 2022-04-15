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
```

## Usage

As node module:

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

In web-browser:

```html
<html>
    <script src="path-to-this-package/dist.web/lib.js" type="application/javascript">
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
</html>
```

## Development & CONTRIBUTING

See [CONTRIBUTING](CONTRIBUTING.md) file for details.

[CycloneDX]: https://cyclonedx.org/
