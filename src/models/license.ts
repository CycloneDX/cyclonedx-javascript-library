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

import spdxExpressionParse from 'spdx-expression-parse'

import type { Sortable } from '../_helpers/sortable'
import type { SpdxId } from '../spdx'
import { isSupportedSpdxId } from '../spdx'
import type { Attachment } from './attachment'

export class LicenseExpression {
  static isEligibleExpression (expression: string | any): boolean {
    if (typeof expression !== 'string') {
      return false
    }
    try {
      spdxExpressionParse(expression)
    } catch (e) {
      return false
    }
    return true
  }

  /** @see {@link expression} */
  #expression!: string

  /**
   * @throws {@link RangeError} if `expression` is empty string
   */
  constructor (expression: LicenseExpression['expression']) {
    this.expression = expression
  }

  get expression (): string {
    return this.#expression
  }

  /**
   * @throws {@link RangeError} if `value` is empty string
   */
  set expression (value: string) {
    if (!LicenseExpression.isEligibleExpression(value)) {
      throw new RangeError('Not eligible expression')
    }
    this.#expression = value
  }

  compare (other: LicenseExpression): number {
    return this.#expression.localeCompare(other.#expression)
  }
}

class DisjunctiveLicenseBase {
  text?: Attachment
  #url?: URL | string

  constructor (op: OptionalDisjunctiveLicenseProperties = {}) {
    this.text = op.text
    this.url = op.url
  }

  get url (): URL | string | undefined {
    return this.#url
  }

  set url (value: URL | string | undefined) {
    this.#url = value === ''
      ? undefined
      : value
  }
}

interface OptionalDisjunctiveLicenseProperties {
  text?: DisjunctiveLicenseBase['text']
  url?: DisjunctiveLicenseBase['url']
}

export interface OptionalNamedLicenseProperties extends OptionalDisjunctiveLicenseProperties {}

export class NamedLicense extends DisjunctiveLicenseBase {
  name: string

  constructor (name: NamedLicense['name'], op: OptionalNamedLicenseProperties = {}) {
    super(op)
    this.name = name
  }

  compare (other: NamedLicense): number {
    return this.name.localeCompare(other.name)
  }
}

export interface OptionalSpdxLicenseProperties extends OptionalDisjunctiveLicenseProperties {}

export class SpdxLicense extends DisjunctiveLicenseBase {
  /** @see {@link id} */
  #id!: SpdxId

  /**
   * @throws {@link RangeError} if `id` is not {@link isSupportedSpdxId | supported}
   */
  constructor (id: SpdxLicense['id'], op: OptionalSpdxLicenseProperties = {}) {
    super(op)
    this.id = id
  }

  get id (): SpdxId {
    return this.#id
  }

  /**
   * @throws {@link RangeError} if value is not {@link isSupportedSpdxId | supported}
   */
  set id (value: SpdxId) {
    if (!isSupportedSpdxId(value)) {
      throw new RangeError('Unknown SPDX id')
    }
    this.#id = value
  }

  compare (other: SpdxLicense): number {
    return this.#id.localeCompare(other.#id)
  }
}

export type DisjunctiveLicense = NamedLicense | SpdxLicense
export type License = DisjunctiveLicense | LicenseExpression

export class LicenseRepository extends Set<License> implements Sortable<License> {
  #compareItems (a: License, b: License): number {
    if (a.constructor === b.constructor) {
      // @ts-expect-error -- classes are from same type -> they are comparable
      return a.compare(b)
    }
    return a.constructor.name.localeCompare(b.constructor.name)
  }

  sorted (): License[] {
    return Array.from(this).sort(this.#compareItems)
  }
}
