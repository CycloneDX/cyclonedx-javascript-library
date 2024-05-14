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

import type { Sortable } from '../_helpers/sortable'
import type { HashAlgorithm } from '../enums/hashAlogorithm'

// no regex for the HashContent in here. It applies at runtime of a normalization/serialization process.
export type HashContent = string

export type Hash = readonly [
  // order matters: it must reflect [key, value] of HashDictionary -
  // this way a HashDictionary can be constructed from multiple Hash objects.
  /* algorithm: */ HashAlgorithm,
  /* content:   */ HashContent,
  // cannot use named tuple syntax ala `[a: T1, b: T2]` as it causes errors when downstream-projects compile with older versions of TypeScript
]

export class HashDictionary extends Map<Hash[0], Hash[1]> implements Sortable<Hash> {
  static #compareItems ([a1, c1]: Hash, [a2, c2]: Hash): number {
    /* eslint-disable @typescript-eslint/strict-boolean-expressions -- run compares in weighted order */
    return a1.localeCompare(a2) ||
      c1.localeCompare(c2)
    /* eslint-enable @typescript-eslint/strict-boolean-expressions */
  }

  sorted (): Hash[] {
    return Array.from(this.entries()).sort(HashDictionary.#compareItems)
  }
}
