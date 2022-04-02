# CycloneDX JavaScript library

Core functionality of CDX for _JavaScript_ (node or web-browser),
written in _TypeScript_ and compiled to the target.

## Install 

```shell
npm i -S @cyclonedx/cyclonedx-library
```

## Usage

As node module:
```javascript
const CycloneDX_library = require('@cyclonedx/cyclonedx-library')

let bom = new CycloneDX_library.models.Bom()
bom.components.add(
    new CycloneDX_library.models.Component(
        CycloneDX_library.enums.ComponentType.Library, 
        'myComponent'
    )
)
```

In web-browser:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>test</title>
    <script src="dist.web/CycloneDX_library.js"></script>
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
