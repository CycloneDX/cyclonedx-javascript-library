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

import type { BomRef } from '../models'

export class BomRefDiscriminator {
  private readonly _originalValues: ReadonlyArray<readonly [BomRef, string | undefined]>

  private readonly _prefix: string

  /* eslint-disable-next-line @typescript-eslint/no-inferrable-types -- docs */
  constructor (bomRefs: Iterable<BomRef>, prefix: string = 'BomRef') {
    this._originalValues = Array.from(bomRefs, r => [r, r.value])
    this._prefix = prefix
  }

  get prefix (): string {
    return this._prefix
  }

  /** Iterate over the {@link BomRef}s. */
  * [Symbol.iterator] (): IterableIterator<BomRef> {
    for (const [bomRef] of this._originalValues) {
      yield bomRef
    }
  }

  discriminate (): void {
    const knownRefValues = new Set<string>([''])
    for (const [bomRef] of this._originalValues) {
      let value = bomRef.value
      if (value === undefined || knownRefValues.has(value)) {
        value = this._makeUniqueId()
        bomRef.value = value
      }
      knownRefValues.add(value)
    }
  }

  reset (): void {
    for (const [bomRef, originalValue] of this._originalValues) {
      bomRef.value = originalValue
    }
  }

  /**
   * generate a string in the format:
   * `${this.prefix}.<random-characters>.<random-characters>`
   */
  private _makeUniqueId (): string {
    return `${
      this._prefix
    }${
      Math.random().toString(32).substring(1)
    }${
      Math.random().toString(32).substring(1)
    }`
  }
}
