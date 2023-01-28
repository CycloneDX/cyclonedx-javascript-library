/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

import { PackageURL } from 'packageurl-js'

import { PackageUrlQualifierNames } from '../_helpers/packageUrl'
import { ExternalReferenceType } from '../enums'
import type { Component } from '../models'

export class PackageUrlFactory {
  readonly #type: PackageURL['type']

  constructor (type: PackageUrlFactory['type']) {
    this.#type = type
  }

  get type (): PackageURL['type'] {
    return this.#type
  }

  makeFromComponent (component: Component, sort: boolean = false): PackageURL | undefined {
    const qualifiers: PackageURL['qualifiers'] = {}
    let subpath: PackageURL['subpath']

    // sorting to allow reproducibility: use the last instance for a `extRef.type`, if multiples exist
    const extRefs = sort
      ? component.externalReferences.sorted()
      : component.externalReferences
    for (const extRef of extRefs) {
      const url = extRef.url.toString()
      if (url.length <= 0) {
        continue
      }
      // No further need for validation.
      // According to https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst
      // there is no formal requirement to a `..._url`.
      // Everything is possible: URL-encoded, not encoded, with schema, without schema
      switch (extRef.type) {
        case ExternalReferenceType.VCS:
          [qualifiers[PackageUrlQualifierNames.VcsUrl], subpath] = url.split('#', 2)
          break
        case ExternalReferenceType.Distribution:
          qualifiers[PackageUrlQualifierNames.DownloadURL] = url
          break
      }
    }

    const hashes = component.hashes
    if (hashes.size > 0) {
      qualifiers[PackageUrlQualifierNames.Checksum] = Array.from(
        sort
          ? hashes.sorted()
          : hashes,
        ([hashAlgo, hashCont]) => `${hashAlgo.toLowerCase()}:${hashCont.toLowerCase()}`
      ).join(',')
    }

    try {
      // Do not beautify the parameters here, because that is in the domain of PackageURL and its representation.
      // No need to convert an empty "subpath" string to `undefined` and such.
      return new PackageURL(
        this.#type,
        component.group,
        component.name,
        component.version,
        qualifiers,
        subpath
      )
    } catch {
      return undefined
    }
  }
}
