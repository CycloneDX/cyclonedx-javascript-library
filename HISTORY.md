# Changelog

All notable changes to this project will be documented in this file.

## 3.0.0 -- 2023-06-28

Added support for [_CycloneDX_ Specification-1.5](https://github.com/CycloneDX/specification/releases/tag/1.5).  
Added functionality regarding [_CycloneDX_ BOM-Link](https://cyclonedx.org/capabilities/bomlink/).  

* BREAKING
  * Interface `Spec.Protocol` now defines new mandatory methods (via [#843])  
    This is only a breaking change if you custom-implemented this interface downstream; internal usage is non-breaking.
* Changed
  * Normalizers support _CycloneDX_ Specification-1.5 ([#505] via [#843])
  * Validators support _CycloneDX_ Specification-1.5 ([#505] via [#843])
  * Some models' properties were widened to support _CycloneDX_ BOM-Link (via [#856])
* Added
  * Existing `Enums` got the new members and values for _CycloneDX_ Specification-1.5 ([#505] via [#843])
  * Namespace `Spec` was enhanced for _CycloneDX_ Specification-1.5 ([#505] via [#843])
  * Dedicated classes and types for _CycloneDX_ BOM-Link (via [#843], [#856], [#857])

### API changes v3 - the details

* BREAKING
  * Interface `Spec.Protocol` now defines a new mandatory method `supportsVulnerabilityRatingMethod()` (via [#843])  
    This is only a breaking change if you custom-implemented this interface downstream; internal usage is non-breaking.
* Changed
  * Namespace `Models`
    * Method `BomRef.compare()` accepts every stringable now, was `Models.BomRef` only (via [#856])
    * Class `ExternalReference`'s property `url` also accepts `BomLink` now, was `URL|string` only (via [#856])
    * Class `Vulnerability.Affect`'s property `ref` also accepts `BomLinkElement` now, was `BomRef` only (via [#856])
  * Namespace `Serialize.{JSON,XML}.Normalize`
    * All classes support _CycloneDX_ Specification-1.5 now ([#505] via [#843])
    * Methods `VulnerabilityRatingNormalizer.normalize()` omit unsupported values for `Models.Vulnerability.Rating.method` (via [#843])  
      This utilizes the new method `Spec.Protocol.supportsVulnerabilityRatingMethod()`.
  * Namespace `Validation`
    * Classes `{Json,JsonStrict,Xml}Validator` support _CycloneDX_ Specification-1.5 now ([#505] via [#843])
* Added
  * Namespace `Enums` 
    * Enum `ComponentType` got new members ([#505] via [#843])  
      New: `Data`, `DeviceDriver`, `MachineLearningModel`, `Platform`
    * Enum `ExternalReferenceType` got new members ([#505] via [#843])  
      New: `AdversaryModel`, `Attestation`, `CertificationReport`, `CodifiedInfrastructure`, `ComponentAnalysisReport`, `Configuration`, `DistributionIntake`, `DynamicAnalysisReport`, `Evidence`, `ExploitabilityStatement`, `Formulation`, `Log`, `MaturityReport`, `ModelCard`, `POAM`, `PentestReport`, `QualityMetrics`, `RiskAssessment`, `RuntimeAnalysisReport`, `SecurityContact`, `StaticAnalysisReport`, `ThreatModel`, `VulnerabilityAssertion`
    * Enum `Vulnerability.RatingMethod` got new members ([#505] via [#843])  
      New: `CVSSv4`, `SSVC`
  * Namespace `Models`
    * New classes `BomLinkDocument` and `BomLinkDocument` to represent _CycloneDX_ BOM-Link (via [#843], [#856], [#857])
    * New type `BomLink` to represent _CycloneDX_ BOM-Link (via [#843], [#856])
  * Namespace `Spec`
    * Enum `Version` got new member `v1dot5` to reflect _CycloneDX_ Specification-1.5 ([#505] via [#843])
    * Constant `SpecVersionDict` got new entry to reflect _CycloneDX_ Specification-1.5 ([#505] via [#843])
    * New constant `Spec1dot5` to reflect _CycloneDX_ Specification-1.5 ([#505] via [#843])
    * Constants `Spec1dot{2,3,4}` got a new method `supportsVulnerabilityRatingMethod()` (via [#843])
    * Interface `Protocol` has a new method `supportsVulnerabilityRatingMethod()` (via [#843])
* Misc
  * Added functional and integration tests for _CycloneDX_ Specification-1.5 ([#505] via [#843])
  * Added unit tests for _CycloneDX_ BOM-Link (via [#843], [#856])
  * Fetched latest stable schema definition files for offline usage (via [#843])
  * Improved internal documentation (via [#856])
* Build
  * Use _TypeScript_ `v5.1.5` now, was `v5.1.3` (via [#860])
  * Use _Webpack_ `v5.88.0` now, was `v5.86.0` (via [#841])

[#505]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/505
[#841]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/841
[#843]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/843
[#856]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/856
[#857]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/857
[#860]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/860

## 2.1.0 -- 2023-06-10

* Changed
  * Classes `Serialize.Xml.Normalize.Vulnerability*Normalizer` are now public available (via [#816])  
    Previously, only instances were available via `Serialize.Xml.Normalize.Factory.makeForVulnerability*()`.
* Build
  * Use _TypeScript_ `v5.1.3` now, was `v5.0.4` (via [#790])
  * Use _Webpack_ `v5.86.0` now, was `v5.82.1` (via [#802])

[#790]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/790
[#802]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/802
[#816]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/816

## 2.0.0 -- 2023-05-17

Improved license detection.  
Finished `Vulnerability` capabilities.  
Added `ComponentEvidence` capabilities.  

* BREAKING
  * Method `Factories.LicenseFactory.makeFromString()` was changed in its behavior ([#271], [#530] via [#547])  
    It will try to create `Models.SpdxLicense` if value is eligible,
    else try to create `Models.LicenseExpression` if value is eligible,
    else fall back to `Models.NamedLicense`.
  * Revisited sort and compare:
    * Methods `Models.*.compare()` may return different numbers than before.
    * Methods `Models.*.sorted()` may return different orders than before.
  * Removed deprecated symbols ([#747] via [#752])
* Changed
  * Removed _beta_ state from symbols `{Enums,Models}.Vulnerability.*` ([#164] via [#722])  
    The structures are defined as stable now.
  * Some property/parameter types were widened, enabling the use of `Buffer` and other data-saving mechanisms ([#406], [#516] via [#753])  
* Added
  * New data models and serialization/normalization for `Models.ComponentEvidence` ([#516] via [#753])
  * Serializers and `Component`-Normalizers will take `Models.Component.evidence` into account ([#516] via [#753])
  * Serializers and `Bom`-Normalizers will take `Models.Bom.vulnerabilities` into account ([#164] via [#722])
* Misc
  * Internal rework, modernization, refactoring

### API changes v2 - the details

* BREAKING
  * Class `Factories.LicenseFactory` was modified
    * Renamed method `makeDisjunctiveWithId()` -> `makeSpdxLicense()` ([#530] via [#547])
    * Renamed method `makeDisjunctiveWithName()` -> `makeNamedLicense()` ([#530] via [#547])
  * Class `Models.LicenseExpression` was modified
    * Removed static function `isEligibleExpression()` (via [#547])  
      Use `Spdx.isValidSpdxLicenseExpression()` instead.
    * Constructor no longer throws, when value is not eligible ([#530] via [#547])  
      You may use `Factories.LicenseFactory.makeExpression()` to mimic the previous behavior.
    * Property `expression` setter no longer throws, when value is not eligible ([#530] via [#547])  
      You may use `Factories.LicenseFactory.makeExpression()` to mimic the previous behavior.
  * Class `Models.SpdxLicense` was modified
    * Constructor no longer throws, when value is not eligible ([#530] via [#547])  
      You may use `Factories.LicenseFactory.makeSpdxLicense()` to mimic the previous behavior.
    * Property `id` setter no longer throws, when value is not eligible ([#530] via [#547])  
      You may use `Factories.LicenseFactory.makeSpdxLicense()` to mimic the previous behavior.
  * Interface `Spec.Protocol` now defines a new mandatory property `supportsComponentEvidence:boolean` (via [#753])
  * Interface `Spec.Protocol` now defines a new mandatory property `supportsVulnerabilities:boolean` (via [#722])
  * Removed deprecated symbols ([#747] via [#752])
    * Namespaces `{Builders,Factories}.FromPackageJson` were removed.  
      You may use `{Builders,Factories}.FromNodePackageJson` instead.
    * Class `Models.HashRepository` was removed.  
      You may use `Models.HashDictionary` instead.
    * Methods `Serialize.{Json,Xml}.Normalize.*.normalizeRepository()` were removed.  
      You may use `Serialize.{Json,Xml}.Normalize.*.normalizeIterable()` instead
    * Type alias `Types.UrnUuid` was removed.  
      You may use `string` instead.
    * Type predicate `Types.isUrnUuid()` was removed.
* Changed
  * Class `Models.Attachment` was modified
    * Property `content` was widened to be any stringable, was `string` ([#406], [#516] via [#753])  
      This enables the use of `Buffer` and other data-saving mechanisms.
  * Class `Models.Component` was modified
    * Property `copyright` was widened to be any stringable, was `string` ([#406], [#516] via [#753])  
      This enables the use of `Buffer` and other data-saving mechanisms.
  * Class `Models.Vulnerability.Credits` was modified
    * Property `organizations` is no longer optional (via [#722])  
      This collection(`Set`) will always exist, but might be empty.  
      This is considered a non-breaking change, as the class was in _beta_ state.
    * Property `individuals` is no longer optional (via [#722])  
      This collection(`Set`) will always exist, but might be empty.  
      This is considered a non-breaking change, as the class was in _beta_ state.
* Added
  * Namespace `Models` was enhanced
    * Class `Component` was enhanced
      * New optional property `evidence` of type `Models.ComponentEvidence` ([#516] via [#753])
    * New Class `ComponentEvidence` ([#516] via [#753])
    * Namespace `Vulnerability` was enhanced
      * Class `Advisory` was enhanced
        * New method `compare()` (via [#722])
      * Class `AdvisoryRepository` was enhanced
        * New method `sorted()` (via [#722])
        * New method `compare()` (via [#722])
      * Class `Affect` was enhanced
        * New method `compare()` (via [#722])
      * Class `AffectRepository` was enhanced
        * New method `sorted()` (via [#722])
        * New method `compare()` (via [#722])
      * Class `AffectedSingleVersion` was enhanced
        * New method `compare()` (via [#722])
      * Class `AffectedVersionRange` was enhanced
        * New method `compare()` (via [#722])
      * Class `AffectedVersionRepository` was enhanced
        * New method `sorted()` (via [#722])
        * New method `compare()` (via [#722])
      * Class `Rating` was enhanced
        * New method `compare()` (via [#722])
      * Class `RatingRepository` was enhanced
        * New method `sorted()` (via [#722])
        * New method `compare()` (via [#722])
      * class `Reference` was enhanced
        * New method `compare()` (via [#722])
      * Class `ReferenceRepository` was enhanced
        * New method `sorted()` (via [#722])
        * New method `compare()` (via [#722])
      * class `Source` was enhanced
        * New method `compare()` (via [#722])
      * class `Vulnerability` was enhanced
        * New method `compare()` (via [#722])
      * Class `VulnerabilityRepository` was enhanced
        * New method `sorted()` (via [#722])
        * New method `compare()` (via [#722])
  * Namespaces `Serialize.{Json,Xml}.Normalize` were enhanced
    * Class `Factory` was enhanced
      * New Method `makeForComponentEvidence()` ([#516] via [#753])
      * New method `makeForVulnerability()` ([#164] via [#722])
      * New method `makeForVulnerabilitySource()` ([#164] via [#722])
      * New method `makeForVulnerabilityReference()` ([#164] via [#722])
      * New method `makeForVulnerabilityRating` ([#164] via [#722])
      * New method `makeForVulnerabilityAdvisory` ([#164] via [#722])
      * New method `makeForVulnerabilityCredits` ([#164] via [#722])
      * New method `makeForVulnerabilityAffect` ([#164] via [#722])
      * New method `makeForVulnerabilityAffectedVersion` ([#164] via [#722])
      * New method `makeForVulnerabilityAnalysis` ([#164] via [#722])
    * New class `ComponentEvidenceNormalizer` ([#516] via [#753])
    * Class `OrganizationalEntityNormalizer` was enhanced
      * New method `normalizeIterable()` (via [#722])
    * New class `VulnerabilityNormalizer` ([#164] via [#722])
    * New class `VulnerabilityAdvisoryNormalizer` ([#164] via [#722])
    * New class `VulnerabilityAffectNormalizer` ([#164] via [#722])
    * New class `VulnerabilityAffectedVersionNormalizer` ([#164] via [#722])
    * New class `VulnerabilityAnalysisNormalizer` ([#164] via [#722])
    * New class `VulnerabilityCreditsNormalizer` ([#164] via [#722])
    * New class `VulnerabilityRatingNormalizer` ([#164] via [#722])
    * New class `VulnerabilityReferenceNormalizer` ([#164] via [#722])
    * New class `VulnerabilitySourceNormalizer` ([#164] via [#722])
  * Namespace `Spec`
    * Constants `Spec1dot{2,3,4}` were enhanced
      * New property `supportsComponentEvidence:boolean` (via [#753])
      * New property `supportsVulnerabilities:boolean` (via [#722])
  * Namespace `Spdx` was enhanced
    * New function `isValidSpdxLicenseExpression()` ([#271] via [#547])
* Misc
  * Added dependency `spdx-expression-parse@^3.0.1` (via [#547])

[#164]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/164
[#271]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/271
[#406]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/406
[#516]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/516
[#530]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/530
[#547]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/547
[#722]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/722
[#747]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/747
[#752]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/752
[#753]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/753

## 1.14.0 -- 2023-04-25

* Added
  * Formal validators for JSON string and XML string ([#620] via [#652], [#691])  
    Currently available only for _Node.js_. Requires [optional dependencies](README.md#optional-dependencies).
    * Related new validator classes:
      * `Validation.JsonValidator`
      * `Validation.JsonStrictValidator`
      * `Validation.XmlValidator`
    * Related new error classes:
      * `Validation.NotImplementedError`
      * `Validation.MissingOptionalDependencyError`
* Build
  * Use _TypeScript_ `v5.0.4` now, was `v4.9.5` ([#549] via [#644])
  * Use _Webpack_ `v5.80.0` now, was `v5.79.0` (via [#686])

[#549]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/549
[#620]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/620
[#644]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/644
[#652]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/652
[#686]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/686
[#691]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/691

## 1.13.3 - 2023-04-05

* Fixed
  * `Serialize.{JSON,XML}.Normalize.LicenseNormalizer.normalizeIterable()` now omits invalid license combinations ([#602] via [#623])  
    If there is any `Models.LicenseExpression`, then this is the only license normalized; otherwise all licenses are normalized.
* Docs
  * Fixed link to CycloneDX-specification in README (via [#617])

[#602]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/602
[#617]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/617
[#623]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/623

## 1.13.2 - 2023-03-29

* Fixed
  * `Builders.FromNodePackageJson.ComponentBuilder` no longer cuts component's name after a slash(`/`) ([#599] via [#600])

[#599]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/599
[#600]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/600

## 1.13.1 - 2023-03-28

* Docs
  * Announce and annotate the generator for BOM's SerialNumber ([#588] via [#598])
  
[#598]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/598

## 1.13.0 - 2023-03-28

* Fixed
  * "Bom.serialNumber" data model can have values following the alternative format allowed in CycloneDX XML specification ([#588] via [#597])
  * `Serialize.{JSON,XML}.Normalize.BomNormalizer.normalize` now omits invalid/unsupported values for serialNumber ([#588] via [#597])
* Changed
  * Property `Models.Bom.serialNumber` is of type `string`, was type-aliased `Types.UrnUuid = string` ([#588] via [#597])  
    Also, the setter no longer throws exceptions, since no string format is illegal.  
    This is considered a non-breaking behavior change, because the corresponding normalizers assure valid data results.
* Added
  * Published generator for BOM's SerialNumber: `Utils.BomUtility.randomSerialNumber()` ([#588] via [#597])  
    The code was donated from [cyclonedx-node-npm](https://github.com/CycloneDX/cyclonedx-node-npm/).
* Deprecation
  * Type alias `Types.UrnUuid = string` became deprecated (via [#597])  
    Use type `string` instead.
  * Function `Types.isUrnUuid` became deprecated (via [#597])

[#588]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/588
[#597]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/597

## 1.12.2 - 2023-03-28

* Fixed
  * Digesting this library in TypeScript build with ECMA Script module results works as expected, now (via [#596])
* Docs
  * Development-docs are no longer packed with releases (via [#572])
* Misc
  * Added more integration tests in CI (via [#596])

[#572]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/572
[#596]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/596

## 1.12.1 - 2023-03-13

Maintenance release.

## 1.12.0 - 2023-03-02

* Docs
  * Made it clear, that `{Builders,Factories}.{FromNodePackageJson,FromPackageJson}.*` functionality is to be run on already normalized structures ([#517] via [#518])  
    Normalization should be done downstream, for example via [`normalize-package-data`](https://www.npmjs.com/package/normalize-package-data).

[#517]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/517
[#518]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/518

## 1.11.0 - 2023-02-02

* Added
  * New vulnerability-related enums were added in a new namespace `Enums.Vulnerability` ([#164] via [#419])  
    _Release stage is “beta”._ These namespace and enums have been released to third-party developers experimentally for the purpose of collecting feedback. These enums should not be used in production, because their contracts may change without notice.
    * `AffectStatus`
    * `AnalysisJustification`
    * `AnalysisResponse`
    * `AnalysisState`
    * `RatingMethod`
    * `Severity`
  * New vulnerability-related models were added in a new namespace `Models.Vulnerability` ([#164] via [#419])  
    _Release stage is “beta”._ These namespace and models have been released to third-party developers experimentally for the purpose of collecting feedback. These models should not be used in production, because their contracts may change without notice.  
    _Attention_: The models are not yet supported by shipped serializers nor shipped normalizers.
    * `Advisory`, `AdvisoryRepository`
    * `Affect`, `AffectRepository`, `AffectedSingleVersion`, `AffectedVersionRange`, `AffectedVersionRepository`
    * `Analysis`
    * `Credits`
    * `Rating`, `RatingRepository`
    * `Reference`, `ReferenceRepository`
    * `Source`
    * `Vulnerability`, `VulnerabilityRepository`
  * New class `Models.OrganizationalEntityRepository` to represent a collection of `Models.OrganizationalEntity` (via [#419])  
    Additionally, `Models.OrganizationalEntity.compare()` was implemented.
  * New types and related functionality Common Weaknesses Enumerations (CWE) were added (via [#419])  
    _Release stage is “beta”._ These types, functions and classes have been released to third-party developers experimentally for the purpose of collecting feedback. These types, functions and classes should not be used in production, because their contracts may change without notice.
    * type `Types.CWE`
    * runtime validation `Types.isCWE()`
    * class `Types.CweRepository`
* Docs
  * Use [TSDoc](https://tsdoc.org/) syntax in TypeScript files, instead of [JSDoc](https://jsdoc.app/) (via [#318], [#453])
* Build
  * Use _TypeScript_ `v4.9.5` now, was `v4.9.4` (via [#463])
* Misc
  * Added tests for internal helpers (via [#454])
  * Use `eslint-config-standard-with-typescript@34.0.0` now, was `33.0.0` (via [#460])

[#164]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/164
[#318]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/318
[#419]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/419
[#453]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/453
[#454]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/454
[#460]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/460
[#463]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/463

## 1.10.0 - 2023-01-28

* Added
  * Typing: Interfaces of models' optional properties are now public API ([#439] via [#440])
  * Ship [TypeDoc](https://typedoc.org) configuration, so that users can build the documentation on demand ([#57] via [#436])
* Fixed
  * XML serializer now properly throws `UnsupportedFormatError` if it is unsupported by the supplied Spec (via [#438])
* Misc
  * Added tests for internal helpers (via [#431])
  * Added more internal sortable data types (via [#165])
  * Fixed type hints in internals (via [#432])
  * Fixed type refs and links in doc-strings (via [#437])
  * Slightly improved performance of compare methods when reproducible results were needed (via [#433])
  * Use `eslint-config-standard-with-typescript@33.0.0` now, was `23.0.0` (via [#382], [#423], [#445])

[#57]:  https://github.com/CycloneDX/cyclonedx-javascript-library/issues/57
[#165]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/165
[#382]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/382
[#423]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/423
[#431]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/431
[#432]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/432
[#433]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/433
[#436]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/436
[#437]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/437
[#438]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/438
[#439]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/439
[#440]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/440
[#445]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/445

## 1.9.2 - 2022-12-16

Maintenance release.

* Docs
  * Fix CI/CT shield ([badges/shields#8671] via [#371])

[badges/shields#8671]: https://github.com/badges/shields/issues/8671
[#371]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/371

## 1.9.1 - 2022-12-10

Maintenance release.

* Build
  * Use _TypeScript_ `v4.9.4` now, was `v4.9.3` (via [#360])

[#360]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/360

## 1.9.0 - 2022-11-19

* Changed
  * Widened the accepted types for first parameter of all `normalizeIterable` methods (via [#317])
* Build
  * Use _TypeScript_ `v4.9.3` now, was `v4.8.4` (via [#335])

[#317]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/317
[#335]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/335

## 1.8.0 - 2022-10-31

* Added
  * Enabled detection for node-package manifest's deprecated licenses format in the node-specific builders ([#308] via [#309])

[#308]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/308
[#309]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/309

## 1.7.0 - 2022-10-25

* Changed
  * Shipped TypeScript declarations are usable by TypeScript v3.8 and above now ([#291] via [#292])
    Previously the source code was abused as type declarations, so they required a certain version of TypeScript 4.

[#291]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/291
[#292]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/292

## 1.6.0 - 2022-09-31

* Changed
  * Removed synthetic default imports im TypeScript sources (via [#243])  
    The resulting _JavaScript_ did not change in functionality.  
    Downstream users of the _TypeScript_ sources/definitions might consider this a feature,
    as they are no longer required to compile with `allowSyntheticDefaultImports` enabled.
* Added
  * Documentation and example regarding dependency tree modelling were added in multiple places (via [#250])  
* Build
  * No longer enable _TypeScript_ config `esModuleInterop` & `allowSyntheticDefaultImports` (via [#243])
  * Use _TypeScript_ `v4.8.4` now, was `v4.8.3` (via [#246])

[#243]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/243
[#246]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/246
[#250]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/250

## 1.5.1 - 2022-09-17

* Deprecated
  * The normalizer methods `normalizeRepository` will be known as `normalizeIterable` (via [#230])

[#230]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/230

## 1.5.0 - 2022-09-17

* Deprecated
  * The class `HashRepository` will be known as `HashDictionary` (via [#229])

[#229]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/229

## 1.4.2 - 2022-09-10

Maintenance release.

* Build
  * Use _TypeScript_ `v4.8.3` now, was `v4.8.2` (via [#212])

[#212]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/212

## 1.4.1 - 2022-09-09

Maintenance release.

* Misc
  * Style: imports are sorted, now (via [#208])
* Dependencies
  * Widened the range of requirement `packageurl-js` to `>=0.0.6 <0.0.8 || ^1`, was `>=0.0.6 <0.0.8` (via [#210])

[#208]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/208
[#210]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/210

## 1.4.0 - 2022-09-07

* Added
  * New class `Factories.FromNodePackageJson.PackageUrlFactory` that acts like `Factories.PackageUrlFactory`, but
    omits PackageUrl's npm-specific "default derived" qualifier values for `download_url` & `vcs_url` ([#204] via [#207])
* Build
  * Use _TypeScript_ `v4.8.2` now, was `v4.7.4` (via [#190])

[#204]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/178
[#207]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/207
[#190]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/190

## 1.3.4 - 2022-08-16

* Fixed
  * `Factories.PackageUrlFactory` omits empty-string URLs for PackageUrl's qualifiers `download_url` & `vcs_url` (via [#180])

[#180]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/180

## 1.3.3 - 2022-08-16

* Fixed
  * Improved omission of invalid `anyURI` when it comes to XML-normalization ([#178] via [#179])

[#178]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/178
[#179]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/179

## 1.3.2 - 2022-08-15

* Fixed
  * Serializers render `bom-ref` values of nested components as unique values, as expected ([#175] via [#176])
* Misc
  * Style: improved readability of constructor parameter types (via [#166])

[#166]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/166
[#175]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/175
[#176]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/176

## 1.3.1 - 2022-08-04

* Fixed
  * JSON- and XML-Normalizer no longer render `Models.Component.properties` with [_CycloneDX_ Specification][CycloneDX-specification]-1.2 ([#152] via [#153])
  * XML-Normalizer now has the correct order/position of rendered `Models.Component.properties` (via [#153])

[#152]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/152
[#153]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/153

## 1.3.0 - 2022-08-03

* Changed
  * Use [version 9b04a94 of CycloneDX specification][CDX-specification#9b04a94474dfcabafe7d3a9f8db6c7e5eb868adb]
    for XML and JSON schema validation (via [#150])
  * Use SPDX license enumeration from
    [version 9b04a94 of CycloneDX specification][CDX-specification#9b04a94474dfcabafe7d3a9f8db6c7e5eb868adb].
    (via [#150])
* Added
  * Models for `Property` and `PropertyRepository` (via [#151])
  * JSON- and XML-Normalizer for `Models.Property`, `Models.PropertyRepository` (via [#151])
  * New property `Models.Component.properties` (via [#151])
* Build
  * Use _Webpack_ `v5.74.0.` now, was `v5.73.0` (via [#141])

[#141]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/141
[#150]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/150
[#151]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/151
[CDX-specification#9b04a94474dfcabafe7d3a9f8db6c7e5eb868adb]: https://github.com/CycloneDX/specification/tree/9b04a94474dfcabafe7d3a9f8db6c7e5eb868adb

## 1.2.0 - 2022-08-01

* Added
  * New getters/properties that represent the corresponding parameters of class constructor (via [#145])
    * `Builders.FromPackageJson.ComponentBuilder.extRefFactory`,  
      `Builders.FromPackageJson.ComponentBuilder.licenseFactory`
    * `Builders.FromPackageJson.ToolBuilder.extRefFactory`
    * `Factories.PackageUrlFactory.type`
    * `Serialize.BomRefDiscriminator.prefix`
    * `Serialize.JsonSerializer.normalizerFactory`
    * `Serialize.XmlBaseSerializer.normalizerFactory`,  
      `Serialize.XmlSerializer.normalizerFactory`
  * Factory for `PackageURL` from `Models.Component` can handle additional data sources, now (via [#146])
    * `Models.Component.hashes` map -> `PackageURL.qualifiers.checksum` list
    * `Models.Component.externalReferences[distribution].url` -> `PackageURL.qualifiers.download_url`
    * Method `Factories.PackageUrlFactory.makeFromComponent()` got a new optional parameter `sort`,
      to indicate whether to go the extra mile and bring hashes and qualifiers in alphabetical order.  
      This feature switch is related to reproducible builds.
* Deprecated
  * The sub-namespace `FromPackageJson` will be known as `FromNodePackageJson` (via [#148])
    * `Factories.FromPackageJson` -> `Factories.FromNodePackageJson`
    * `Builders.FromPackageJson` -> `Builders.FromNodePackageJson`

[#145]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/145
[#146]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/146
[#148]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/148

## 1.1.0 - 2022-07-29

* Added
  * Support for nested/bundled (sub-)components via `Models.Component.components` was added, including
    serialization/normalization of models and impact on dependency graphs rendering ([#132] via [#136])
  * [_CycloneDX_ Specification][CycloneDX-specification]-1.4 made element `Models.Component.version` optional.
    Therefore, serialization/normalization with this specification version will no longer render this element
    if its value is empty (via [#137], [#138])

[#132]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/132
[#136]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/136
[#137]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/137
[#138]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/138

## 1.0.3 - 2022-07-28

* Fixed
  * `Types.isCPE()` for CPE2.3 allows escaped(`\`) chars `&"><`, as expected (via [#134])

[#134]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/134

## 1.0.2 - 2022-07-26

Maintenance release.

* Dependencies
  * Widened the range of requirement `packageurl-js` to `>=0.0.6 <0.0.8`, was `^0.0.7` ([#130] via [#131])

[#130]: https://github.com/CycloneDX/cyclonedx-javascript-library/issues/130
[#131]: https://github.com/CycloneDX/cyclonedx-javascript-library/pull/131

## 1.0.1 - 2022-07-23

Maintenance release.

* Build
  * Use _TypeScript_ `v4.7.4` now, was `v4.6.4` (via [#55])
* Dependencies
  * Raised the requirement of `packageurl-js` to `^0.0.7`, was `^0.0.6` (via [#123])

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
