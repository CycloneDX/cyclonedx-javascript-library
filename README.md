# CycloneDX JavaScript library

Core functionality of [CycloneDX] for _JavaScript_ (node or web-browser),
written in _TypeScript_ and compiled to the target.

## Install

This package and the build results are available as npm package:
```shell
npm i -S @cyclonedx/cyclonedx-library
```

However, you can install the package from source,
which will build automatically on installation:
```shell
npm i -S git@github.com:CycloneDX/cyclonedx-javascript-library.git
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
<!DOCTYPE html>
<html lang="en">
<head>
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
</head>
</html>
```

## Development

### Set up the project

Install dependencies:
```shell
npm ci
```

The setup will also build the project.

### Build from source

Build the JavaScript:
```shell
npm run build
```

### Test the build result

Run the tests:
```shell
npm test
```

[CycloneDX]: https://cyclonedx.org/
