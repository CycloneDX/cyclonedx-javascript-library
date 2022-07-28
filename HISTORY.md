# Changelog

All notable changes to this project will be documented in this file.

## unreleased

* Added
  * Implemented support for nested/bundled components via `bom.component.components`. ([#132] via [#136])
  * CycloneDX spec version 1.4 made element `bom.component.version` optional.  
    Therefore, serialization/normalization with this spec version will no longer render this element,
    when its value is empty. (via [#137], [#138])

[#132]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/132
[#136]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/136
[#137]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/137
[#138]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/138

## 1.0.3 - 2022-07-28

* Fixed
  * `Types.isCPE()` for CPE2.3 allows escaped(`\`) chars `&"><`, as expected. (via [#134])

[#134]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/134

## 1.0.2 - 2022-07-26

Maintenance release.

* Dependencies
  * Widened the range of requirement `packageurl-js` to `>=0.0.6 <0.0.8`, was `^0.0.7`. ([#130] via [#131])

[#130]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/130
[#131]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/131

## 1.0.1 - 2022-07-23

Maintenance release.

* Misc
  * Use TypeScript `v4.7.4` now, was `v4.6.4`.
* Dependencies
  * Raised the requirement of `packageurl-js` to `^0.0.7`, was `^0.0.6`.

## 1.0.0 - 2022-06-20

Initial release.

* Responsibilities
  * Provide a general purpose _JavaScript_-implementation of [_CycloneDX_][CycloneDX] for _Node.js_ and _WebBrowsers_.
  * Provide typing for said implementation, so developers and dev-tools can rely on it.
  * Provide data models to work with _CycloneDX_.
  * Provide a JSON- and an XML-normalizer, that...
    * supports all shipped data models.
    * respects any injected [_CycloneDX_ Specification][CycloneDX-spec] and generates valid output according to it.
    * can be configured to generate reproducible/deterministic output.
    * can prepare data structures for JSON- and XML-serialization.
  * Serialization:
    * Provide a universal JSON-serializer for all target environments.
    * Provide an XML-serializer for all target environments.
    * Support the downstream implementation of custom XML-serializers tailored to specific environments  
      by providing an abstract base class that takes care of normalization and BomRef-discrimination.  
      This is done, because there is no universal XML support in _JavaScript_.
* Capabilities & Features
  * Enums for the following use cases:
    * `AttachmentEncoding`
    * `ComponentScope`
    * `ComponentType`
    * `ExternalReferenceType`
    * `HashAlgorithm`
  * Data models for the following use cases:
    * `Attachment`
    * `Bom`
    * `BomRef`, `BomRefRepository`
    * `Component`, `ComponentRepository`
    * `ExternalReference`, `ExternalReferenceRepository`
    * `HashContent`, `Hash`, `HashRepository`
    * `LicenseExpression`, `NamedLicense`, `SpdxLicense`, `LicenseRepository`
    * `Metadata`
    * `OrganizationalContact`, `OrganizationalContactRepository`
    * `OrganizationalEntity`
    * `SWID`
    * `Tool`, `ToolRepository`
  * Factories for the following use cases:
    * Create data models from any license descriptor string
    * Specific to _Node.js_: create data models from PackageJson-like data structures
  * Builders for the following use cases:
    * Specific to _Node.js_: create deep data models from PackageJson-like data structures
  * Implementation of the [_CycloneDX_ Specification][CycloneDX-spec] for the following versions:
    * `1.4`
    * `1.3`
    * `1.2`
  * Normalizers that convert data models to JSON structures
  * Normalizers that convert data models to XML structures
  * Universal serializer that converts `Bom` data models to JSON string
  * Serializer that converts `Bom` data models to XML string:
    * Specific to _WebBrowsers_: implementation utilizes browser-specific document generators and printers.
    * Specific to _Node.js_: implementation plugs/requires/utilizes one of the following *optional* libraries
      * [xmlbuilder2](https://www.npmjs.com/package/xmlbuilder2)

[CycloneDX]: https://cyclonedx.org/
[CycloneDX-spec]: https://github.com/CycloneDX/specification/tree/main/schema
