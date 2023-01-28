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

/**
 * @see [CycloneDX Property Taxonomy](https://github.com/CycloneDX/cyclonedx-property-taxonomy)
 */
export class Property implements Comparable<Property> {
  name: string
  value: string

  constructor (name: Property['name'], value: Property['value']) {
    this.name = name
    this.value = value
  }

  compare (other: Property): number {
    /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- run compares in weighted order */
    return this.name.localeCompare(other.name) ||
      this.value.localeCompare(other.value)
  }
}

export class PropertyRepository extends SortableComparables<Property> {
}
