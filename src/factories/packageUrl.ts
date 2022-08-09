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

import { Component } from '../models'
import { PackageURL } from 'packageurl-js'
import { ExternalReferenceType } from '../enums'

export class PackageUrlFactory {
  readonly #type: PackageURL['type']

  constructor (type: PackageUrlFactory['type']) {
    this.#type = type
  }

  get type (): PackageURL['type'] {
    return this.#type
  }

  makeFromComponent (component: Component, sort: boolean = false): PackageURL | undefined {
    /**
     * For the list/spec of the well-known keys, see
     * {@link https://github.com/package-url/purl-spec/blob/master/PURL-SPECIFICATION.rst#known-qualifiers-keyvalue-pairs}
     */
    const qualifiers: PackageURL['qualifiers'] = {}
    let subpath: PackageURL['subpath']

    const extRefs = component.externalReferences
    for (const extRef of (sort ? extRefs.sorted() : extRefs)) {
      switch (extRef.type) {
        case ExternalReferenceType.VCS:
          [qualifiers.vcs_url, subpath] = extRef.url.toString().split('#', 2)
          break
        case ExternalReferenceType.Distribution:
          qualifiers.download_url = extRef.url.toString()
          break
      }
    }

    const hashes = component.hashes
    if (hashes.size > 0) {
      qualifiers.checksum = Array.from(
        sort ? hashes.sorted() : hashes,
        ([hashAlgo, hashCont]) => `${hashAlgo.toLowerCase()}:${hashCont.toLowerCase()}`
      ).join(',')
    }

    try {
      // Do not beautify the parameters here, because that is in the domain of PackageURL and its representation.
      // No need to convert an empty `subpath` string to `undefined` and such.
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
