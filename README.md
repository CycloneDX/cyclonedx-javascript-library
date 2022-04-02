# CycloneDX JavaScript library

Core functionality of CDX for _JavaScript_ (node or web-browser),
written in _TypeScript_ and compiled to the target.

## Install 

```shell
npm i -S @cyclonedx/cyclonedx-library
```

## Usage

Example 1:
```javascript
const cdx = require('@cyclonedx/cyclonedx-library')
let bom = new cdx.models.Bom()
bom.components.add(
    new cdx.models.Component(cdx.enums.ComponentType.Library, 'myComponent'))
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
