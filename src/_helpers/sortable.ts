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

import { Stringable } from './stringable'

export interface Sortable<T> {
  sorted: () => T[]
}

export abstract class SortableStringable<T extends Stringable> extends Set<T> implements Sortable<T> {
  sorted (): T[] {
    return Array.from(this).sort((a: T, b: T) => a.toString().localeCompare(b.toString()))
  }
}

export abstract class SortableNumbers<T extends number> extends Set<T> implements Sortable<T> {
  sorted (): T[] {
    return Array.from(this).sort((a: T, b: T) => a - b)
  }
}

export interface Comparable<TOther> {
  // The purpose of this method is not to test for equality, but have deterministic comparability.
  compare: (other: TOther) => number
}

export abstract class SortableSet<TItem extends Comparable<TItem>>
  extends Set<TItem>
  implements Sortable<TItem>, Comparable<SortableSet<TItem>>
{
  sorted (): TItem[] {
    return Array.from(this).sort((a, b) => a.compare(b))
  }

  compare (other: SortableSet<TItem>) : number {
    const sortedOther = other.sorted()
    const sortedSelf = this.sorted()

    if (sortedSelf.length !== sortedOther.length ) {
      return sortedSelf.length - sortedOther.length
    }

    // it was asserted, that both lists have equal length -> zip-like compare
    for (let i = sortedSelf.length - 1 ; i >= 0 ; --i ) {
      const iCompared = sortedSelf[i].compare(sortedOther[i])
      if ( 0 !== iCompared) {
        return iCompared
      }
    }

    return 0
  }
}
