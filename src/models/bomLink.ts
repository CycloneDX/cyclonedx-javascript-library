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
import type { Stringable } from '../_helpers/stringable'

abstract class BomLinkBase implements Stringable, Comparable<Stringable> {
  /* @ts-expect-error TS2564 */
  #value: string

  /** @internal */
  protected abstract _isValid (value: any): boolean

  /**
   * @throws {@link RangeError} if value is invalid
   */
  constructor (value: string) {
    this.value = value
  }

  get value (): string {
    return this.#value
  }

  /**
   * @throws {@link RangeError} if value is invalid
   */
  set value (value: string) {
    if (!this._isValid(value)) {
      throw new RangeError('invalid value')
    }
    this.#value = value
  }

  compare (other: Stringable): number {
    return this.toString().localeCompare(other.toString())
  }

  toString (): string {
    return this.value
  }
}

/**
 * Descriptor for another BOM document.
 *
 * See [the docs](https://cyclonedx.org/capabilities/bomlink/)
 */
export class BomLinkDocument extends BomLinkBase {
  /* regular expressions were taken from the CycloneDX schema definitions. */
  static readonly #pattern = /^urn:cdx:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[1-9][0-9]*$/

  /**
   * Whether the `value` is a valid descriptor for another BOM document.
   */
  static isValid (value: any): boolean {
    return typeof value === 'string' &&
      this.#pattern.test(value)
  }

  /** @internal */
  protected _isValid (value: any): boolean {
    return BomLinkDocument.isValid(value)
  }
}

/**
 * Descriptor for an element in a BOM document.
 *
 * See [the docs](https://cyclonedx.org/capabilities/bomlink/)
 */
export class BomLinkElement extends BomLinkBase {
  /* regular expressions were taken from the CycloneDX schema definitions. */
  static readonly #pattern = /^urn:cdx:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[1-9][0-9]*#.+$/

  /**
   * Whether the `value` is a valid descriptor for an element in a BOM document.
   */
  static isValid (value: any): boolean {
    return typeof value === 'string' &&
      this.#pattern.test(value)
  }

  /** @internal */
  protected _isValid (value: any): boolean {
    return BomLinkElement.isValid(value)
  }
}

/**
 * Either {@link BomLinkDocument} or {@link BomLinkElement}.
 *
 * See [the docs](https://cyclonedx.org/capabilities/bomlink/)
 */
export type BomLink = BomLinkDocument | BomLinkElement
