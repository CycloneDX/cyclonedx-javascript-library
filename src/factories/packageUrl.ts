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

enum PackageUrlQualifierNames {
  DownloadURL = 'download_url',
  VcsUrl = 'vcs_url',
  Checksum = 'checksum',
}

const npmDefaultRegistryMatcher = /^https?:\/\/registry\.npmjs\.org/

type PackageUrlQualifiers = Map<PackageUrlQualifierNames, string>

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
    const qualifiers: PackageUrlQualifiers = new Map()
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
      let vcsUrl: [path: string, anchor: string | undefined]
      // No further need for validation.
      // According to https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst
      // there is no formal requirement to a `..._url`.
      // Everything is possible: URL-encoded, not encoded, with schema, without schema
      switch (extRef.type) {
        case ExternalReferenceType.VCS:
          /* @ts-expect-error TS2322 */
          vcsUrl = url.split('#', 2)
          qualifiers.set(PackageUrlQualifierNames.VcsUrl, vcsUrl[0])
          subpath = vcsUrl[1]
          break
        case ExternalReferenceType.Distribution:
          qualifiers.set(PackageUrlQualifierNames.DownloadURL, url)
          break
      }
    }

    const hashes = component.hashes
    if (hashes.size > 0) {
      qualifiers.set(
        PackageUrlQualifierNames.Checksum,
        Array.from(
          sort ? hashes.sorted() : hashes,
          ([hashAlgo, hashCont]) => `${hashAlgo.toLowerCase()}:${hashCont.toLowerCase()}`
        ).join(',')
      )
    }

    try {
      // Do not beautify the parameters here, because that is in the domain of PackageURL and its representation.
      // No need to convert an empty "subpath" string to `undefined` and such.
      return new PackageURL(
        this.#type,
        component.group,
        component.name,
        component.version,
        this.#finalizeQualifiers(qualifiers),
        subpath
      )
    } catch {
      return undefined
    }
  }

  /**
   * Will strip unnecessary qualifiers according to {@link https://github.com/package-url/purl-spec/blob/master/PURL-SPECIFICATION.rst#known-qualifiers-keyvalue-pairs PURL-SPECIFICATION}:
   * > Do not abuse qualifiers: it can be tempting to use many qualifier keys but their usage should be limited
   * > to the bare minimum for proper package identification to ensure that a purl stays compact and readable
   * > in most cases.
   *
   * Therefore,
   * - "vcs_url" is stripped if a "download_url" is given.
   * - "download_url" is stripped, if it is NPMs default registry ("registry.npmjs.org")
   * - "checksum" is stripped unless a "download_url" or "vcs_url" is given.
   */
  #finalizeQualifiers (qualifiers: PackageUrlQualifiers): PackageURL['qualifiers'] {
    const downloadUrl = qualifiers.get(PackageUrlQualifierNames.DownloadURL)
    if (downloadUrl !== undefined) {
      qualifiers.delete(PackageUrlQualifierNames.VcsUrl)
      if (npmDefaultRegistryMatcher.test(downloadUrl)) {
        qualifiers.delete(PackageUrlQualifierNames.DownloadURL)
      }
    }
    if (!qualifiers.has(PackageUrlQualifierNames.DownloadURL) && !qualifiers.has(PackageUrlQualifierNames.VcsUrl)) {
      // nothing to base a checksum on
      qualifiers.delete(PackageUrlQualifierNames.Checksum)
    }
    return qualifiers.size > 0
      ? Object.fromEntries(qualifiers.entries())
      : undefined
  }
}
