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
Copyright (c) Steve Springett. All Rights Reserved.
*/

import { HashAlgorithm } from '../enums'

// no regex for the HashContent in here. It applies at runtime of a normalization/serialization process.
export type HashContent = string

export type Hash = readonly [
  // order matters: it must reflect [key, value] of HashRepository -
  // this way a HashRepository can be constructed from multiple Hash objects.
  algorithm: HashAlgorithm,
  content: HashContent
]

export class HashRepository extends Map<Hash[0], Hash[1]> {
  static compareItems (a: Hash, b: Hash): number {
    /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- run compares in weighted order */
    return a[0].localeCompare(b[0]) ||
      a[1].localeCompare(b[1])
  }
}
