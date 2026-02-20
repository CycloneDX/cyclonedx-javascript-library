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

import { isNotUndefined } from '../../_helpers/notUndefined'
import { ExternalReferenceType } from '../../enums/externalReferenceType'
import { HashAlgorithm } from '../../enums/hashAlogorithm'
import { ExternalReference } from '../../models/externalReference'
import { HashDictionary } from '../../models/hash'
import { tryCanonicalizeGitUrl } from './_helpers/gitUrl'
import type { NodePackageJson } from './types'
import { parsePackageIntegrity } from './utils'

/**
 * Node-specific ExternalReferenceFactory.
 */
export class ExternalReferenceFactory {
  makeExternalReferences (data: NodePackageJson): ExternalReference[] {
    const refs: Array<ExternalReference | undefined> = []

    try { refs.push(this.makeVcs(data)) } catch { /* pass */ }
    try { refs.push(this.makeHomepage(data)) } catch { /* pass */ }
    try { refs.push(this.makeIssueTracker(data)) } catch { /* pass */ }
    try { refs.push(this.makeDist(data)) } catch { /* pass */ }

    return refs.filter(isNotUndefined)
  }

  makeVcs (data: NodePackageJson): ExternalReference | undefined {
    /* see https://docs.npmjs.com/cli/v9/configuring-npm/package-json#repositoryc */
    const repository = data.repository
    let url  // eslint-disable-line @typescript-eslint/init-declarations -- ack
    let comment  // eslint-disable-line @typescript-eslint/init-declarations -- ack
    if (typeof repository === 'object') {
      url = tryCanonicalizeGitUrl(repository.url)
      comment = 'as detected from PackageJson property "repository.url"'
      if (typeof repository.directory === 'string' && url instanceof URL) {
        // node does not properly encode `#` in the hash ... need to manually esscape
        url.hash = repository.directory.replace(/#/g, '%23')
        comment += ' and "repository.directory"'
      }
    } else {
      url = tryCanonicalizeGitUrl(repository)
      comment = 'as detected from PackageJson property "repository"'
    }
    return url === undefined
      ? undefined
      // cast to string so the URL is frozen/immutable
      : new ExternalReference(url.toString(), ExternalReferenceType.VCS, { comment })
  }

  makeHomepage (data: NodePackageJson): ExternalReference | undefined {
    /* see https://docs.npmjs.com/cli/v9/configuring-npm/package-json#homepage */
    const url = data.homepage
    return typeof url === 'string' && url.length > 0
      ? new ExternalReference(
        url, ExternalReferenceType.Website,
        { comment: 'as detected from PackageJson property "homepage"' })
      : undefined
  }

  makeIssueTracker (data: NodePackageJson): ExternalReference | undefined {
    /* see https://docs.npmjs.com/cli/v9/configuring-npm/package-json#bugs */
    const bugs = data.bugs
    let url  // eslint-disable-line @typescript-eslint/init-declarations -- ack
    let comment  // eslint-disable-line @typescript-eslint/init-declarations -- ack
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

  makeDist(data: NodePackageJson): ExternalReference | undefined {
    // "dist" might be used in bundled dependencies' manifests.
    // docs: https://blog.npmjs.org/post/172999548390/new-pgp-machinery
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- acknowledged */
    const { tarball, integrity, shasum } = data.dist ?? {}
    if (typeof tarball === 'string') {
      const hashes = new HashDictionary()
      let comment = 'as detected from PackageJson property "dist.tarball"'
      if (typeof integrity === 'string') {
        try {
          // actually not the hash of the file, but more of an integrity-check -- lets use it anyway.
          // see https://blog.npmjs.org/post/172999548390/new-pgp-machinery
          hashes.set(...parsePackageIntegrity(integrity))
          comment += ' and property "dist.integrity"'
        } catch { /* pass */ }
      }
      if (typeof shasum === 'string' && shasum.length === 40) {
        hashes.set(HashAlgorithm['SHA-1'], shasum)
        comment += ' and property "dist.shasum"'
      }
      return new ExternalReference(tarball, ExternalReferenceType.Distribution, { hashes, comment })
    }
    return undefined
  }
}
