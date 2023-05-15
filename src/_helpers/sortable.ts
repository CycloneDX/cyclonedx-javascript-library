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

import type { Stringable } from './stringable'

export interface Sortable<TItem> {
  sorted: () => TItem[]
}

export interface Comparable<TOther> {
  /**
   * Compare one object with another.
   *
   * The purpose of this method is not to test for equality, but have deterministic comparability.
   * As long as this method is deterministic, there is no need for a proper ordering in any result/downstream.
   */
  compare: (other: TOther) => number
}

export const compareObjectsSymbol = Symbol('internal compare function')

export type SortableIterable<TItem> = Iterable<TItem> & Sortable<TItem>

export abstract class SortableSet<TItem> extends Set<TItem> implements SortableIterable<TItem>, Comparable<Sortable<TItem>> {
  /**
   * Comparator function to apply to two items.
   */
  protected abstract [compareObjectsSymbol] (a: TItem, b: TItem): number

  /**
   * Get a sorted array of all items in the collection..
   */
  sorted (): TItem[] {
    return Array.from(this).sort(this[compareObjectsSymbol])
  }

  /**
   * Comparator function to apply to two objects of the collection..
   */
  compare (other: Sortable<TItem>): number {
    const sortedOther = other.sorted()
    const sortedSelf = this.sorted()

    if (sortedSelf.length !== sortedOther.length) {
      return sortedSelf.length - sortedOther.length
    }

    // it was asserted, that both lists have equal length -> zip-like compare
    for (let i = sortedSelf.length - 1; i >= 0; --i) {
      const iCompared = this[compareObjectsSymbol](sortedSelf[i], sortedOther[i])
      if (iCompared !== 0) {
        return iCompared
      }
    }

    return 0
  }
}

export class SortableComparables<TItem extends Comparable<any>> extends SortableSet<TItem> {
  protected [compareObjectsSymbol] (a: TItem, b: TItem): number {
    if (a.constructor === b.constructor) {
      return a.compare(b)
    }
    return a.constructor.name.localeCompare(b.constructor.name)
  }
}

export class SortableStringables<TItem extends Stringable = Stringable> extends SortableSet<TItem> {
  protected [compareObjectsSymbol] (a: TItem, b: TItem): number {
    return a.toString().localeCompare(b.toString())
  }
}

export class SortableNumbers<TItem extends number = number> extends SortableSet<TItem> {
  protected [compareObjectsSymbol] (a: TItem, b: TItem): number {
    return a - b
  }
}
