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
import { SortableComparables, SortableStringables } from '../_helpers/sortable'
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
    /* eslint-disable @typescript-eslint/strict-boolean-expressions -- run compares in weighted order */
    return (this.name ?? '').localeCompare(other.name ?? '') ||
      this.contact.compare(other.contact) ||
      (new SortableStringables(this.url)).compare(new SortableStringables(other.url))
    /* eslint-enable @typescript-eslint/strict-boolean-expressions */
  }
}

export class OrganizationalEntityRepository extends SortableComparables<OrganizationalEntity> {}
