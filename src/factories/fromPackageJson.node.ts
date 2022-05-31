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

import * as Models from '../models'
import * as Enums from '../enums'
import { isNotUndefined } from '../helpers/notUndefined'
import { PackageJson } from '../helpers/packageJson'

/**
 * @see {@link https://docs.npmjs.com/cli/v8/configuring-npm/package-json PackageJson spec}
 */

export class ExternalReferenceFactory {
  makeExternalReferences (data: PackageJson): Models.ExternalReference[] {
    const refs: Array<Models.ExternalReference | undefined> = []

    try { refs.push(this.makeVcs(data)) } catch { /* pass */ }
    try { refs.push(this.makeHomepage(data)) } catch { /* pass */ }
    try { refs.push(this.makeIssueTracker(data)) } catch { /* pass */ }

    return refs.filter(isNotUndefined)
  }

  makeVcs (data: PackageJson): Models.ExternalReference | undefined {
    /** @see {@link https://docs.npmjs.com/cli/v8/configuring-npm/package-json#repository the spec} */
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
      ? new Models.ExternalReference(url, Enums.ExternalReferenceType.VCS, { comment })
      : undefined
  }

  makeHomepage (data: PackageJson): Models.ExternalReference | undefined {
    /** @see {@link https://docs.npmjs.com/cli/v8/configuring-npm/package-json#homepage the spec} */
    const url = data.homepage
    return typeof url === 'string' && url.length > 0
      ? new Models.ExternalReference(
        url, Enums.ExternalReferenceType.Website,
        { comment: 'as detected from PackageJson property "homepage"' })
      : undefined
  }

  makeIssueTracker (data: PackageJson): Models.ExternalReference | undefined {
    /** @see {@link https://docs.npmjs.com/cli/v8/configuring-npm/package-json#bugs the spec} */
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
      ? new Models.ExternalReference(url, Enums.ExternalReferenceType.IssueTracker, { comment })
      : undefined
  }
}
