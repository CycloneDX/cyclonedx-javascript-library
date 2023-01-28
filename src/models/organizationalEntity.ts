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

import type { Comparable } from '../_helpers/sortable'
import { SortableComparables } from '../_helpers/sortable'
import { OrganizationalContactRepository } from './organizationalContact'

export interface OptionalOrganizationalEntityProperties {
  name?: OrganizationalEntity['name']
  url?: OrganizationalEntity['url']
  contact?: OrganizationalEntity['contact']
}

export class OrganizationalEntity implements Comparable<OrganizationalEntity> {
  name?: string
  url: Set<URL | string>
  contact: OrganizationalContactRepository

  constructor (op: OptionalOrganizationalEntityProperties = {}) {
    this.name = op.name
    this.url = op.url ?? new Set()
    this.contact = op.contact ?? new OrganizationalContactRepository()
  }

  compare (other: OrganizationalEntity): number {
    const nameCompare = (this.name ?? '').localeCompare(other.name ?? '')
    if (nameCompare !== 0) {
      return nameCompare
    }

    const urlSizeDiff = this.url.size - other.url.size
    if (urlSizeDiff !== 0) {
      return urlSizeDiff
    }
    const sortedUrls = [...this.url].map(u => u.toString()).sort()
    const otherUrls = [...other.url].map(u => u.toString()).sort()
    for (let i = 0; i < sortedUrls.length; i++) {
      const urlCompare = sortedUrls[i].localeCompare(otherUrls[i])
      if (urlCompare !== 0) {
        return urlCompare
      }
    }

    if (this.contact !== undefined && other.contact !== undefined) {
      return this.contact.compare(other.contact)
    }
    return 0
  }
}

export class OrganizationalEntityRepository extends SortableComparables<OrganizationalEntity> {
}
