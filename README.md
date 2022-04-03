# CycloneDX JavaScript library

Core functionality of CDX for _JavaScript_ (node or web-browser),
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

let bom = new cdx.models.Bom()
bom.components.add(
    new cdx.models.Component(
        cdx.enums.ComponentType.Library, 
        'myComponent'
    )
)
```

In web-browser:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>example</title>
    <script src="dist.web/lib.js"></script>
</head>
<body>
<p>Library is available as <em>CycloneDX_library</em>.</p>
</body>
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
npm run test
```
