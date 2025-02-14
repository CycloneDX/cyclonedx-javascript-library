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
import type { ExternalReferenceType } from '../enums/externalReferenceType'
import type { BomLink } from './bomLink'
import { HashDictionary } from './hash'


export interface OptionalExternalReferenceProperties {
  hashes?: ExternalReference['hashes']
  comment?: ExternalReference['comment']
}

export class ExternalReference implements Comparable<ExternalReference> {
  url: URL | BomLink | string
  type: ExternalReferenceType
  hashes: HashDictionary
  comment?: string

  constructor (url: ExternalReference['url'], type: ExternalReference['type'], op: OptionalExternalReferenceProperties = {}) {
    this.url = url
    this.type = type
    this.hashes = op.hashes ?? new HashDictionary()
    this.comment = op.comment
  }

  compare (other: ExternalReference): number {
    // The purpose of this method is not to test for equality, but have deterministic comparability.
    /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- run compares in weighted order */
    return this.type.localeCompare(other.type) ||
      this.url.toString().localeCompare(other.url.toString())
  }
}

export class ExternalReferenceRepository extends SortableComparables<ExternalReference> {
}
