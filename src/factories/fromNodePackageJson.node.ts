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

/**
 * Node-specifics.
 *
 * Intended to run on normalized data structures
 * based on [PackageJson spec](https://github.com/SchemaStore/schemastore/blob/master/src/schemas/json/package.json)
 * and explained by [PackageJson description](https://docs.npmjs.com/cli/v9/configuring-npm/package-json).
 * Normalization should be done downstream, for example via [`normalize-package-data`](https://www.npmjs.com/package/normalize-package-data).
 */

import type { PackageURL } from 'packageurl-js'

import { isNotUndefined } from '../_helpers/notUndefined'
import type { PackageJson } from '../_helpers/packageJson'
import { PackageUrlQualifierNames } from '../_helpers/packageUrl'
import { ExternalReferenceType } from '../enums/externalReferenceType'
import type { Component } from '../models/component'
import { ExternalReference } from '../models/externalReference'
import { PackageUrlFactory as PlainPackageUrlFactory } from './packageUrl'

/**
 * Node-specific ExternalReferenceFactory.
 */
export class ExternalReferenceFactory {
  makeExternalReferences (data: PackageJson): ExternalReference[] {
    const refs: Array<ExternalReference | undefined> = []

    try { refs.push(this.makeVcs(data)) } catch { /* pass */ }
    try { refs.push(this.makeHomepage(data)) } catch { /* pass */ }
    try { refs.push(this.makeIssueTracker(data)) } catch { /* pass */ }

    return refs.filter(isNotUndefined)
  }

  makeVcs (data: PackageJson): ExternalReference | undefined {
    /* see https://docs.npmjs.com/cli/v9/configuring-npm/package-json#repositoryc */
    const repository = data.repository
    let url
    let comment: string | undefined
    if (typeof repository === 'object') {
      url = repository.url
      comment = 'as detected from PackageJson property "repository.url"'
      if (typeof repository.directory === 'string' && typeof url === 'string' && url.length > 0) {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        url += '#' + repository.directory
        comment += ' and "repository.directory"'
      }
    } else {
      url = repository
      comment = 'as detected from PackageJson property "repository"'
    }
    return typeof url === 'string' && url.length > 0
      ? new ExternalReference(url, ExternalReferenceType.VCS, { comment })
      : undefined
  }

  makeHomepage (data: PackageJson): ExternalReference | undefined {
    /* see https://docs.npmjs.com/cli/v9/configuring-npm/package-json#homepage */
    const url = data.homepage
    return typeof url === 'string' && url.length > 0
      ? new ExternalReference(
        url, ExternalReferenceType.Website,
        { comment: 'as detected from PackageJson property "homepage"' })
      : undefined
  }

  makeIssueTracker (data: PackageJson): ExternalReference | undefined {
    /* see https://docs.npmjs.com/cli/v9/configuring-npm/package-json#bugs */
    const bugs = data.bugs
    let url
    let comment: string | undefined
    if (typeof bugs === 'object') {
      url = bugs.url
      comment = 'as detected from PackageJson property "bugs.url"'
    } else {
      url = bugs
      comment = 'as detected from PackageJson property "bugs"'
    }
    return typeof url === 'string' && url.length > 0
      ? new ExternalReference(url, ExternalReferenceType.IssueTracker, { comment })
      : undefined
  }
}

const npmDefaultRegistryMatcher = /^https?:\/\/registry\.npmjs\.org(:?\/|$)/

/**
 * Node-specific PackageUrlFactory.
 */
export class PackageUrlFactory extends PlainPackageUrlFactory {
  override makeFromComponent (component: Component, sort: boolean = false): PackageURL | undefined {
    const purl = super.makeFromComponent(component, sort)
    return purl === undefined
      ? undefined
      : this.#finalizeQualifiers(purl)
  }

  /**
   * Will strip unnecessary qualifiers according to [PURL-SPECIFICATION](https://github.com/package-url/purl-spec/blob/master/PURL-SPECIFICATION.rst#known-qualifiers-keyvalue-pairs).
   * <blockquote cite="https://github.com/package-url/purl-spec/blob/master/PURL-SPECIFICATION.rst#known-qualifiers-keyvalue-pairs">
   *   Do not abuse qualifiers: it can be tempting to use many qualifier keys but their usage should be limited
   *   to the bare minimum for proper package identification to ensure that a purl stays compact and readable
   *   in most cases.
   * </blockquote>
   *
   * Therefore:
   * - "vcs_url" is stripped, if a "download_url" is given.
   * - "download_url" is stripped, if it is NPM's default registry ("registry.npmjs.org")
   * - "checksum" is stripped, unless a "download_url" or "vcs_url" is given.
   */
  #finalizeQualifiers (purl: PackageURL): PackageURL {
    const qualifiers = new Map(Object.entries(purl.qualifiers ?? {}))

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
    purl.qualifiers = qualifiers.size > 0
      ? Object.fromEntries(qualifiers.entries())
      : undefined

    return purl
  }
}
