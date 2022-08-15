# Changelog

All notable changes to this project will be documented in this file.

## unreleased

## 1.3.2 - 2022-08-15

* Fixed
  * Serializers render `bom-ref` values of nested components as unique values, as expected. ([#175] via [#176])
* Misc
  * Style: improved readability of constructor parameter types. (via [#166])

[#166]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/166
[#175]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/175
[#176]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/176

## 1.3.1 - 2022-08-04

* Fixed
  * JSON- and XML-Normalizer no longer render `Models.Component.properties`
    with [_CycloneDX_ Specification][CycloneDX-specification]-1.2.
    ([#152] via [#153])
  * XML-Normalizer now has the correct order/position of rendered `Models.Component.properties`. (via [#153])

[#152]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/152
[#153]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/153

## 1.3.0 - 2022-08-03

* Changed
  * Use [version 9b04a94 of CycloneDX specification][CDX-specification#9b04a94474dfcabafe7d3a9f8db6c7e5eb868adb]
    for XML and JSON schema validation. (via [#150])
  * Use SPDX license enumeration from
    [version 9b04a94 of CycloneDX specification][CDX-specification#9b04a94474dfcabafe7d3a9f8db6c7e5eb868adb].
    (via [#150])
* Added
  * Models for `Property` and `PropertyRepository`. (via [#151])
  * JSON- and XML-Normalizer for `Models.Property`, `Models.PropertyRepository`. (via [#151])
  * New property `Models.Component.properties`. (via [#151])
* Build
  * Use _Webpack_ `v5.74.0.` now, was `5.73.0`. (via [#141])

[#141]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/141
[#150]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/150
[#151]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/151
[CDX-specification#9b04a94474dfcabafe7d3a9f8db6c7e5eb868adb]: https://github.com/CycloneDX/specification/tree/9b04a94474dfcabafe7d3a9f8db6c7e5eb868adb

## 1.2.0 - 2022-08-01

* Added
  * New getters/properties that represent the corresponding parameters of class constructor. (via [#145])
    * `Builders.FromPackageJson.ComponentBuilder.extRefFactory`,  
      `Builders.FromPackageJson.ComponentBuilder.licenseFactory`
    * `Builders.FromPackageJson.ToolBuilder.extRefFactory`
    * `Factories.PackageUrlFactory.type`
    * `Serialize.BomRefDiscriminator.prefix`
    * `Serialize.JsonSerializer.normalizerFactory`
    * `Serialize.XmlBaseSerializer.normalizerFactory`,  
      `Serialize.XmlSerializer.normalizerFactory`
  * Factory for `PackageURL` from `Models.Component` can handle additional data sources, now. (via [#146])
    * `Models.Component.hashes` map -> `PackageURL.qualifiers.checksum` list
    * `Models.Component.externalReferences[distribution].url` -> `PackageURL.qualifiers.download_url`
    * Method `Factories.PackageUrlFactory.makeFromComponent()` got a new optional parameter `sort`,
      to indicate whether to go the extra mile and bring hashes and qualifiers in alphabetical order.  
      This feature switch is related to reproducible builds.
* Deprecated
  * The sub-namespace `FromPackageJson` will be known as `FromNodePackageJson`. (via [#148])
    * `Factories.FromPackageJson` -> `Factories.FromNodePackageJson`
    * `Builders.FromPackageJson` -> `Builders.FromNodePackageJson`

[#145]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/145
[#146]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/146
[#148]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/148

## 1.1.0 - 2022-07-29

* Added
  * Support for nested/bundled (sub-)components via `Models.Component.components` was added, including
    serialization/normalization of models and impact on dependency graphs rendering. ([#132] via [#136])
  * [_CycloneDX_ Specification][CycloneDX-specification]-1.4 made element `Models.Component.version` optional.
    Therefore, serialization/normalization with this specification version will no longer render this element
    if its value is empty. (via [#137], [#138])

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

* Build
  * Use _TypeScript_ `v4.7.4` now, was `v4.6.4`. (via [#55])
* Dependencies
  * Raised the requirement of `packageurl-js` to `^0.0.7`, was `^0.0.6`. (via [#123])

[#55]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/55
[#123]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/123

## 1.0.0 - 2022-06-20

Initial release.

* Responsibilities
  * Provide a general purpose _JavaScript_-implementation of [_CycloneDX_][CycloneDX] for _Node.js_ and _WebBrowsers_.
  * Provide typing for said implementation, so developers and dev-tools can rely on it.
  * Provide data models to work with _CycloneDX_.
  * Provide a JSON- and an XML-normalizer, that...
    * supports all shipped data models.
    * respects any injected [_CycloneDX_ Specification][CycloneDX-specification] and generates valid output according to it.
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
  * Implementation of the [_CycloneDX_ Specification][CycloneDX-specification] for the following versions:
    * `1.4`
    * `1.3`
    * `1.2`
  * Normalizers that convert data models to JSON structures
  * Normalizers that convert data models to XML structures
  * Universal serializer that converts `Bom` data models to JSON string
  * Serializer that converts `Bom` data models to XML string:
    * Specific to _WebBrowsers_: implementation utilizes browser-specific document generators and printers.
    * Specific to _Node.js_: implementation plugs/requires/utilizes one of the following _optional_ libraries
      * [xmlbuilder2](https://www.npmjs.com/package/xmlbuilder2)

[CycloneDX]: https://cyclonedx.org/
[CycloneDX-specification]: https://github.com/CycloneDX/specification/tree/main/schema
