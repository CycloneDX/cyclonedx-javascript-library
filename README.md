[![shield_license]][license_file]  
[![shield_website]][link_website]
[![shield_slack]][link_slack]
[![shield_groups]][link_discussion]
[![shield_twitter-follow]][link_twitter]

----

# CycloneDX JavaScript Library

Core functionality of [CycloneDX] for _JavaScript_ (_Node.js_ or _WebBrowsers_),
written in _TypeScript_ and compiled to the target.

## Responsibilities

* Bring general purpose JavaScript implementation for _Node.js_ and _WebBrowsers_.
* Bring typing for said implementation, so developers and dev-tools can rely on it.
* Bring core data models to the target environment.
* Bring normalization to the target environment, that...
    * supports all shipped data models.
    * respects any injected [CycloneDX Specification][CycloneDX-spec] and generates valid output according to it.
    * takes care of BomRef-discrimination (uniqueness - not meaning).
    * can be configured to generate reproducible/deterministic output.
* Bring serialization to the target environment:
    * Only for _WebBrowsers_.  
      There is no built-in capability for XML in _Node.js_, so no common implementation can be done.
* Allow users to implement custom serializers tailored to their target environment.

## Capabilities

* Enums for the following use cases
    * `AttachmentEncoding`
    * `ComponentScope`
    * `ComponentType`
    * `ExternalReferenceType`
    * `HashAlgorithm`
* Data models for the following use cases
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
* Factory, that can create data models from any license descriptor string
* Implementation of the [CycloneDX Specification][CycloneDX-spec] for the following versions:
    * `1.4`
    * `1.3`
    * `1.2`
* Normalizer that converts data models to JSON structures
* Normalizer that converts data models to XML structures
* General purpose serializer that converts data models to JSON string
* Specific to _WebBrowsers_: Serializer that converts data models to XML string

## Installation

This package and the build results are available for npm and yarn:

```shell
npm i -S @cyclonedx/cyclonedx-library
yarn add @cyclonedx/cyclonedx-library
```

You can install the package from source,
which will build automatically on installation:

```shell
npm i -S github:CycloneDX/cyclonedx-javascript-library
# not supported with yarn
```

## Usage

### As _Node.js_ package

```javascript
const cdx = require('@cyclonedx/cyclonedx-library')

const bom = new cdx.Models.Bom()
bom.components.add(
  new cdx.Models.Component(
    cdx.Enums.ComponentType.Library,
    'myComponent'
  )
)
```

### In _WebBrowsers_

```html
<script src="path-to-this-package/dist.web/lib.js">
    // full Library is available as `CycloneDX_library`, per default
</script>
<script type="application/javascript">
    const cdx = CycloneDX_library

    let bom = new cdx.Models.Bom()
    bom.components.add(
            new cdx.Models.Component(
                    cdx.Enums.ComponentType.Library,
                    'myComponent'
            )
    )
</script>
```

## Development & Contributing

Feel free to open issues, bugreports or pull requests.  
See the [CONTRIBUTING][contributing_file] file for details.

## License

Permission to modify and redistribute is granted under the terms of the Apache 2.0 license.  
See the [LICENSE][license_file] file for the full license.

[CycloneDX]: https://cyclonedx.org/
[CycloneDX-spec]: https://github.com/CycloneDX/specification/tree/master/schema

[license_file]: https://github.com/CycloneDX/cyclonedx-javascript-library/blob/master/LICENSE
[contributing_file]: https://github.com/CycloneDX/cyclonedx-javascript-library/blob/master/CONTRIBUTING.md

[shield_license]: https://img.shields.io/github/license/CycloneDX/cyclonedx-javascript-library?logo=open%20source%20initiative&logoColor=white "license"
[shield_website]: https://img.shields.io/badge/https://-cyclonedx.org-blue.svg "homepage"
[shield_slack]: https://img.shields.io/badge/slack-join-blue?logo=Slack&logoColor=white "slack join"
[shield_groups]: https://img.shields.io/badge/discussion-groups.io-blue.svg "groups discussion"
[shield_twitter-follow]: https://img.shields.io/badge/Twitter-follow-blue?logo=Twitter&logoColor=white "twitter follow"

[link_website]: https://cyclonedx.org/
[link_slack]: https://cyclonedx.org/slack/invite
[link_discussion]: https://groups.io/g/CycloneDX
[link_twitter]: https://twitter.com/CycloneDX_Spec
