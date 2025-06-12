# CycloneDX JavaScript Library

[![shield_npm-version]][link_npm]
[![shield_rtfd]][link_rtfd]
[![shield_gh-workflow-test]][link_gh-workflow-test]
[![shield_coverage]][link_codacy]
[![shield_ossf-best-practices]][link_ossf-best-practices]
[![shield_license]][license_file]  
[![shield_website]][link_website]
[![shield_slack]][link_slack]
[![shield_groups]][link_discussion]
[![shield_twitter-follow]][link_twitter]

----

Core functionality of [_CycloneDX_][link_website] for _JavaScript_ (_Node.js_ or _WebBrowsers_),
written in _TypeScript_ and compiled for the target.

> [!NOTE]  
> This package is a software library not intended for standalone use.  
> For a list of tools and plugins for generating Software Bill of Materials (SBOM), check out the [meta-package](https://github.com/CycloneDX/cyclonedx-node-module?tab=readme-ov-file#readme).

## Responsibilities

* Provide a general purpose _JavaScript_-implementation of [_CycloneDX_][link_website] for _Node.js_ and _WebBrowsers_.
* Provide typing for said implementation, so developers and dev-tools can rely on it.
* Provide data models to work with _CycloneDX_.
* Provide JSON- and XML-normalizers, that...
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
* Provide formal JSON- and XML-validators according to [_CycloneDX_ Specification][CycloneDX-spec]. (currently for _Node.js_ only)

## Capabilities

* Enums for the following use cases:
  * `AttachmentEncoding`
  * `ComponentScope`
  * `ComponentType`
  * `ExternalReferenceType`
  * `HashAlgorithm`
  * `Vulnerability` related:  
    * `AffectStatus`
    * `AnalysisJustification`
    * `AnalysisResponse`
    * `AnalysisState`
    * `RatingMethod`
    * `Severity`
* Data models for the following use cases:
  * `Attachment`
  * `Bom`
  * `BomLink`, `BomLinkDocument`, `BomLinkElement`
  * `BomRef`, `BomRefRepository`
  * `Component`, `ComponentRepository`, `ComponentEvidence`
  * `ExternalReference`, `ExternalReferenceRepository`
  * `Hash`, `HashContent`,  `HashDictionary`
  * `LicenseExpression`, `NamedLicense`, `SpdxLicense`, `LicenseRepository`
  * `Metadata`
  * `OrganizationalContact`, `OrganizationalContactRepository`
  * `OrganizationalEntity`, `OrganizationalEntityRepository`
  * `Property`, `PropertyRepository`
  * `SWID`
  * `Tool`, `ToolRepository`, `Tools`
  * `Vulnerability` related:
    * `Advisory`, `AdvisoryRepository`
    * `Affect`, `AffectRepository`, `AffectedSingleVersion`, `AffectedVersionRange`, `AffectedVersionRepository`
    * `Analysis`
    * `Credits`
    * `Rating`, `RatingRepository`
    * `Reference`, `ReferenceRepository`
    * `Source`
    * `Vulnerability`, `VulnerabilityRepository`
* Utilities for the following use cases:
  * Generate valid random SerialNumbers for `Bom.serialNumber`
  * Gather license evidences from files (for _Node.js_ only)
* Factories for the following use cases:
  * Create data models from any license descriptor string
  * Create `PackageURL` from `Component` data models
  * Specific to _Node.js_: create data models from PackageJson-like data structures and derived data
* Builders for the following use cases:
  * Specific to _Node.js_: create deep data models `Tool` or `Component` from PackageJson-like data structures
* Implementation of the [_CycloneDX_ Specification][CycloneDX-spec] for the following versions:
  * `1.6`
  * `1.5`
  * `1.4`
  * `1.3`
  * `1.2`
* Normalizers that convert data models to JSON structures
* Normalizers that convert data models to XML structures
* Universal serializer that converts `Bom` data models to JSON string
* Specific  Serializer that converts `Bom` data models to XML string:
  * Specific to _WebBrowsers_: implementation utilizes browser-specific document generators and printers.
  * Specific to _Node.js_: implementation utilizes [optional dependencies](#optional-dependencies) as described below
* Formal validators for JSON string and XML string (currently for _Node.js_ only)  
  Requires [optional dependencies](#optional-dependencies) as described below

## Installation

This package and the build results are available for _npm_, _pnpm_ and _yarn_:

```shell
npm i -S @cyclonedx/cyclonedx-library
pnpm add @cyclonedx/cyclonedx-library
yarn add @cyclonedx/cyclonedx-library
```

You can install the package from source,
which will build automatically on installation:

```shell
npm i -S github:CycloneDX/cyclonedx-javascript-library
pnpm add github:CycloneDX/cyclonedx-javascript-library
yarn add @cyclonedx/cyclonedx-library@github:CycloneDX/cyclonedx-javascript-library # only with yarn-2
```

## Optional Dependencies

Some dependencies are optional.
See the shipped `package.json` for version constraints.

* Serialization to XML on _Node.js_ requires any of:
  * [`xmlbuilder2`](https://www.npmjs.com/package/xmlbuilder2)
* Validation of JSON on _Node.js_ requires all of:
  * [`ajv`](https://www.npmjs.com/package/ajv)
  * [`ajv-formats`](https://www.npmjs.com/package/ajv-formats)
  * [`ajv-formats-draft2019`](https://www.npmjs.com/package/ajv-formats-draft2019)
* Validation of XML on _Node.js_ requires all of:
  * [`libxmljs2`](https://www.npmjs.com/package/libxmljs2)  
  * the system might need to meet the requirements for [`node-gyp`](https://github.com/TooTallNate/node-gyp#installation), in certain cases.

## Usage

See extended [examples].

### As _Node.js_ package

```javascript
const CDX = require('@cyclonedx/cyclonedx-library')

const bom = new CDX.Models.Bom()
bom.metadata.component = new CDX.Models.Component(
  CDX.Enums.ComponentType.Application,
  'MyProject'
)
const componentA = new CDX.Models.Component(
  CDX.Enums.ComponentType.Library,
  'myComponentA',
)
bom.components.add(componentA)
bom.metadata.component.dependencies.add(componentA.bomRef)
```

### In _WebBrowsers_

```html
<script src="path-to-this-package/dist.web/lib.js"></script>
<script type="application/javascript">
    const CDX = CycloneDX_library

    let bom = new CDX.Models.Bom()
    bom.metadata.component = new CDX.Models.Component(
        CDX.Enums.ComponentType.Application,
        'MyProject'
    )
    const componentA = new CDX.Models.Component(
        CDX.Enums.ComponentType.Library,
        'myComponentA',
    )
    bom.components.add(componentA)
    bom.metadata.component.dependencies.add(componentA.bomRef)
</script>
```

## API documentation

We ship annotated type definitions, so that your IDE and tools may pick up the documentation when you use this library downstream.

There are also pre-rendered documentations hosted on [readthedocs][link_rtfd].

## Development & Contributing

Feel free to open issues, bug reports or pull requests.  
See the [CONTRIBUTING][contributing_file] file for details.

## License

Permission to modify and redistribute is granted under the terms of the Apache 2.0 license.  
See the [LICENSE][license_file] file for the full license.

[CycloneDX-spec]: https://github.com/CycloneDX/specification/#readme

[license_file]: https://github.com/CycloneDX/cyclonedx-javascript-library/blob/main/LICENSE
[contributing_file]: https://github.com/CycloneDX/cyclonedx-javascript-library/blob/main/CONTRIBUTING.md
[examples]: https://github.com/CycloneDX/cyclonedx-javascript-library/tree/main/examples/README.md
[link_rtfd]: https://cyclonedx-javascript-library.readthedocs.io

[shield_npm-version]: https://img.shields.io/npm/v/%40cyclonedx%2fcyclonedx-library/latest?label=npm&logo=npm&logoColor=white "npm"
[shield_rtfd]: https://img.shields.io/readthedocs/cyclonedx-javascript-library?logo=readthedocs&logoColor=white "Read the Docs"
[shield_gh-workflow-test]: https://img.shields.io/github/actions/workflow/status/CycloneDX/cyclonedx-javascript-library/nodejs.yml?branch=main&logo=GitHub&logoColor=white "tests"
[shield_coverage]: https://img.shields.io/codacy/coverage/ae6c086b53d54653ad5077b12ec22264?logo=Codacy&logoColor=white "test coverage"
[shield_ossf-best-practices]: https://img.shields.io/cii/percentage/7883?label=OpenSSF%20best%20practices "OpenSSF best practices"
[shield_license]: https://img.shields.io/github/license/CycloneDX/cyclonedx-javascript-library?logo=open%20source%20initiative&logoColor=white "license"
[shield_website]: https://img.shields.io/badge/https://-cyclonedx.org-blue.svg "homepage"
[shield_slack]: https://img.shields.io/badge/slack-join-blue?logo=Slack&logoColor=white "slack join"
[shield_groups]: https://img.shields.io/badge/discussion-groups.io-blue.svg "groups discussion"
[shield_twitter-follow]: https://img.shields.io/badge/Twitter-follow-blue?logo=Twitter&logoColor=white "twitter follow"

[link_website]: https://cyclonedx.org/
[link_npm]: https://www.npmjs.com/package/%40cyclonedx/cyclonedx-library

[link_gh-workflow-test]: https://github.com/CycloneDX/cyclonedx-javascript-library/actions/workflows/nodejs.yml?query=branch%3Amain
[link_codacy]: https://app.codacy.com/gh/CycloneDX/cyclonedx-javascript-library/dashboard
[link_ossf-best-practices]: https://www.bestpractices.dev/projects/7883
[link_slack]: https://cyclonedx.org/slack/invite
[link_discussion]: https://groups.io/g/CycloneDX
[link_twitter]: https://twitter.com/CycloneDX_Spec
