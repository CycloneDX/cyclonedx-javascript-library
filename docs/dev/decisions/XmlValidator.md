# XML Validator

It was goal of https://github.com/CycloneDX/cyclonedx-javascript-library/pull/520
to add validation support for XML BOM documents based on the CycloneDX XSD specification.

As there is no native XML support in JavaScript, 
it was researched which solution existed in the both build targets: NodeJS and WebBrowser

## NodeJS

Utilizing te existing [`libxml2`](https://github.com/GNOME/libxml2) seamed appealing.
This lib has all needed capabilities and was already utilized for similar purposes.

To get the `libxml2` linked/accessible to NodeJS, native bindings via yp are required.  
There are several implementations for this: 
* [`libxmljs`](https://www.npmjs.com/package/libxmljs)
  *  maintained and working -- was abandoned for some time, and appears to be maintaines sporadically, again
* [`libxmljs2`](https://www.npmjs.com/package/libxmljs2)
  * ~~maintained~~ and working fork of `libxmljs`
  * as of 2024-05-24, this library is [no longer mainained](https://github.com/marudor/libxmljs2/commit/7ef018cfa3be3b908530e0cb4f3b6bdec6af6633)
  * This library was used as an optional dependency, and [needs to be replaced](https://github.com/CycloneDX/cyclonedx-javascript-library/issues/1079)
* [`libxmljs3`](https://www.npmjs.com/package/libxmljs3)
  * unmaintained copy of `libxmljs2`
  * ! DO NOT USE !
* [`libxml2-wasm`](https://www.npmjs.com/package/libxml2-wasm)
  * maintained WASM implementation of a libxml2 wrapper
* Any alternative? Please open a pull-request to add them.

At the moment of writing (2023-04-21),
`libxmljs` and `libxmljs2` are both working on several test environments. Both had the needed capabilities.

### Decision

#### 2023-04-23

Decided to go with `libxmljs2` for the moment, 
as it was more popular/used and had a more active community.

#### 2024-05-24

Decided to replace `libxmljs2`, as it is end of life.

## WebBrowsers

there seams to exist no solution for validating XML according to XSD
