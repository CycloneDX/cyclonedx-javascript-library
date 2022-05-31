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

import { ExternalReferenceType } from '../enums'

interface OptionalProperties {
  comment?: ExternalReference['comment']
}

export class ExternalReference {
  url: URL | string
  type: ExternalReferenceType
  comment?: string

  constructor (url: URL | string, type: ExternalReferenceType, op: OptionalProperties = {}) {
    this.url = url
    this.type = type
    this.comment = op.comment
  }

  compare (other: ExternalReference): number {
    /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- run compares in weighted order */
    return this.type.localeCompare(other.type) ||
      this.url.toString().localeCompare(other.url.toString())
  }
}

export class ExternalReferenceRepository extends Set<ExternalReference> {
  static compareItems (a: ExternalReference, b: ExternalReference): number {
    return a.compare(b)
  }
}
