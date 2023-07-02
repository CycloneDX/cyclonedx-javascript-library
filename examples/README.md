# Examples

## Usage

* `node/javascript` showcases the usage in Node.js JavaScript
  * [`example.cjs`](node/javascript/example.cjs) targets JavaScript, "commonjs" style.
  * [`example.mjs`](node/javascript/example.mjs) targets JavaScript, "module"   style.
* `node/typescript` showcases the usage in Node.js TypeScript
  * [`example.cjs`](node/typescript/example.cjs) targets JavaScript, "commonjs" style - from TypeScript `^3.8 || ^4 || ^5`.
  * [`example.mjs`](node/typescript/example.mjs) targets JavaScript, "module"   style - from TypeScript `^4 || ^5`.
* `web/parcel` showcases the usage in web browser when compiled by [_Parcel_](https://parceljs.org/):
  * [`src/index.html`](web/parcel/src/index.html) will be compiled to  
    [`dist/index.html`](web/parcel/dist/index.html) and runs in any web browser.
* `web/webpack` showcases the usage in web browser when compiled by [_Webpack_](https://webpack.js.org/):
  * [`src/index.js`](web/webpack/src/index.js) will be compiled, so that it can be embedded by  
    [`dist/index.html`](web/webpack/dist/index.html) and runs in any web browser.

## Data models

The [`models` test data](../tests/_data/models.js) holds also examples for complete structures
with all possible use cases, all nesting, and advanced complexity.
