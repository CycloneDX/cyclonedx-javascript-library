[![shield_gh-workflow-test]][link_gh-workflow-test]
[![shield_npm-version]][link_npm]
[![shield_license]][license_file]  
[![shield_website]][link_website]
[![shield_slack]][link_slack]
[![shield_groups]][link_discussion]
[![shield_twitter-follow]][link_twitter]

----

# CycloneDX JavaScript Library

Core functionality of [_CycloneDX_][link_website] for _JavaScript_ (_Node.js_ or _WebBrowsers_),
written in _TypeScript_ and compiled for the target.

## Responsibilities

* Provide a general purpose _JavaScript_-implementation of [_CycloneDX_][link_website] for _Node.js_ and _WebBrowsers_.
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

## Capabilities

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
  * `Hash`, `HashContent`,  `HashDictionary`
  * `LicenseExpression`, `NamedLicense`, `SpdxLicense`, `LicenseRepository`
  * `Metadata`
  * `OrganizationalContact`, `OrganizationalContactRepository`
  * `OrganizationalEntity`
  * `Property`, `PropertyRepository`
  * `SWID`
  * `Tool`, `ToolRepository`
* Factories for the following use cases:
  * Create data models from any license descriptor string
  * Create `PackageURL` from `Component` data models
  * Specific to _Node.js_: create data models from PackageJson-like data structures and derived data
* Builders for the following use cases:
  * Specific to _Node.js_: create deep data models `Tool` or `Component` from PackageJson-like data structures
* Implementation of the [_CycloneDX_ Specification][CycloneDX-spec] for the following versions:
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
    * ... to be continued ... (pull requests are welcome)

## Installation

This package and the build results are available for _npm_, _yarn_ and _pnpm_:

```shell
npm i -S @cyclonedx/cyclonedx-library
yarn add @cyclonedx/cyclonedx-library
pnpm add @cyclonedx/cyclonedx-library
```

You can install the package from source,
which will build automatically on installation:

```shell
npm i -S github:CycloneDX/cyclonedx-javascript-library
# not supported with yarn
# not supported with pnpm
```

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

There is no pre-rendered documentation at the time.  
Instead, there are annotated type definitions, so that your IDE and tools may pick up the documentation when you use this library downstream.

## Development & Contributing

Feel free to open issues, bugreports or pull requests.  
See the [CONTRIBUTING][contributing_file] file for details.

## License

Permission to modify and redistribute is granted under the terms of the Apache 2.0 license.  
See the [LICENSE][license_file] file for the full license.

[CycloneDX-spec]: https://github.com/CycloneDX/specification/tree/main/schema

[license_file]: https://github.com/CycloneDX/cyclonedx-javascript-library/blob/main/LICENSE
[contributing_file]: https://github.com/CycloneDX/cyclonedx-javascript-library/blob/main/CONTRIBUTING.md
[examples]: https://github.com/CycloneDX/cyclonedx-javascript-library/tree/main/examples/README.md

[shield_gh-workflow-test]: https://img.shields.io/github/actions/workflow/status/CycloneDX/cyclonedx-javascript-library/nodejs.yml?branch=main&logo=GitHub&logoColor=white "tests"
[shield_npm-version]: https://img.shields.io/npm/v/@cyclonedx/cyclonedx-library?logo=npm&logoColor=white "npm"
[shield_license]: https://img.shields.io/github/license/CycloneDX/cyclonedx-javascript-library?logo=open%20source%20initiative&logoColor=white "license"
[shield_website]: https://img.shields.io/badge/https://-cyclonedx.org-blue.svg "homepage"
[shield_slack]: https://img.shields.io/badge/slack-join-blue?logo=Slack&logoColor=white "slack join"
[shield_groups]: https://img.shields.io/badge/discussion-groups.io-blue.svg "groups discussion"
[shield_twitter-follow]: https://img.shields.io/badge/Twitter-follow-blue?logo=Twitter&logoColor=white "twitter follow"

[link_website]: https://cyclonedx.org/
[link_gh-workflow-test]: https://github.com/CycloneDX/cyclonedx-javascript-library/actions/workflows/nodejs.yml?query=branch%3Amain
[link_npm]: https://www.npmjs.com/package/@cyclonedx/cyclonedx-library
[link_slack]: https://cyclonedx.org/slack/invite
[link_discussion]: https://groups.io/g/CycloneDX
[link_twitter]: https://twitter.com/CycloneDX_Spec
