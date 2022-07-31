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

import { BomRef } from '../models'

export class BomRefDiscriminator {
  readonly #originalValues: ReadonlyMap<BomRef, string | undefined>

  readonly #prefix: string

  constructor (bomRefs: Iterable<BomRef>, prefix: string = 'BomRef') {
    this.#originalValues = new Map(
      Array.from(bomRefs).map(ref => [ref, ref.value])
    )
    this.#prefix = prefix
  }

  get prefix (): string {
    return this.#prefix
  }

  /** Iterate over the bomRefs. */
  [Symbol.iterator] (): IterableIterator<BomRef> {
    return this.#originalValues.keys()
  }

  discriminate (): void {
    const knownRefValues = new Set<string>()
    for (const [bomRef] of this.#originalValues) {
      let value = bomRef.value
      if (value === undefined || knownRefValues.has(value)) {
        value = this.#makeUniqueId()
        bomRef.value = value
      }
      knownRefValues.add(value)
    }
  }

  reset (): void {
    for (const [bomRef, originalValue] of this.#originalValues) {
      bomRef.value = originalValue
    }
  }

  /**
   * generate a string in the format:
   * <prefix>.<some-characters>.<some-characters>
   */
  #makeUniqueId (): string {
    return `${
      this.#prefix
    }${
      Math.random().toString(32).substring(1)
    }${
      Math.random().toString(32).substring(1)
    }`
  }
}
