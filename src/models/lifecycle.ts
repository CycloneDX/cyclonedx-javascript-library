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

import type { Comparable, Sortable } from '../_helpers/sortable'
import type { LifecyclePhase } from '../enums/lifecyclePhase'

export interface OptionalNamedLifecycleProperties {
  description?: NamedLifecycle['description']
}

export class NamedLifecycle implements Comparable<NamedLifecycle> {
  name: string
  description?: string

  constructor (name: string, op: OptionalNamedLifecycleProperties = {}) {
    this.name = name
    this.description = op.description
  }

  compare (other: NamedLifecycle): number {
    return this.name.localeCompare(other.name)
  }
}

export type Lifecycle = LifecyclePhase | NamedLifecycle

export class LifecycleRepository extends Set<Lifecycle> implements Sortable<Lifecycle> {
  static #compareItems (a: Lifecycle, b: Lifecycle): number {
    if (a.constructor === b.constructor) {
      return a instanceof NamedLifecycle
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- false-positive */
        ? a.compare(b as typeof a)
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- false-positive */
        : a.localeCompare(b as typeof a)
    }
    return a.constructor.name.localeCompare(b.constructor.name)
  }

  sorted (): Lifecycle[] {
    return Array.from(this).sort(LifecycleRepository.#compareItems)
  }
}
