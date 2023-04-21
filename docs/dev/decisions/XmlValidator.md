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
  *  maintained and working
* [`libxmljs2`](https://www.npmjs.com/package/libxmljs2)
  * maintained and working fork of `libxmljs`
* [`libxmljs3`](https://www.npmjs.com/package/libxmljs3)
  * unmaintained copy of `libxmljs2`
  * ! DO NOT USE !

At the moment of writing, `libxmljs` and `libxmljs2` are both working on several test environments.
Both had the needed capabilities.

### Decision

Decided to go with `libxmljs2` for the moment, 
as it was more popular/used and had a more active community.


## WebBrowsers

there seams to exist no solution for validating XML according to XSD
