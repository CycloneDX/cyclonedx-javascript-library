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

import type { Sortable } from '../_helpers/sortable'
import type { SpdxId } from '../spdx'
import type { Attachment } from './attachment'
import {BomRef} from "./bomRef";

/**
 * (SPDX) License Expression.
 *
 * No validation is done internally.
 * You may validate with {@link SPDX.isValidSpdxLicenseExpression | SPDX.isValidSpdxLicenseExpression()}.
 * You may assert valid objects with {@link Factories.LicenseFactory.makeExpression | Factories.LicenseFactory.makeExpression()}.
 */
export class LicenseExpression {
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
    if (value === '') {
      throw new RangeError('value is empty string')
    }
    this.#expression = value
  }

  compare (other: LicenseExpression): number {
    return this.#expression.localeCompare(other.#expression)
  }
}

class DisjunctiveLicenseBase {
  bomRef: BomRef
  text?: Attachment
  #url?: URL | string

  constructor (op: OptionalDisjunctiveLicenseProperties = {}) {
    this.bomRef = new BomRef(op.bomRef)
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
  bomRef?: BomRef['value']
  text?: DisjunctiveLicenseBase['text']
  url?: DisjunctiveLicenseBase['url']
}

export interface OptionalNamedLicenseProperties extends OptionalDisjunctiveLicenseProperties {}

export class NamedLicense extends DisjunctiveLicenseBase {
  name: string

  constructor (name: string, op: OptionalNamedLicenseProperties = {}) {
    super(op)
    this.name = name
  }

  compare (other: NamedLicense): number {
    return this.name.localeCompare(other.name) ||
      this.bomRef.compare(other.bomRef)
  }
}

export interface OptionalSpdxLicenseProperties extends OptionalDisjunctiveLicenseProperties {}

/**
 * Disjunctive license with (SPDX-)ID - aka SpdxLicense.
 *
 * No validation is done internally.
 * You may validate with {@link SPDX.isSupportedSpdxId | SPDX.isSupportedSpdxId()}.
 * You may assert valid objects with {@link Factories.LicenseFactory.makeSpdxLicense | Factories.LicenseFactory.makeSpdxLicense()}.
 */
export class SpdxLicense extends DisjunctiveLicenseBase {
  /** @see {@link id} */
  #id!: SpdxId

  /**
   * @throws {@link RangeError} if `id` is empy string
   */
  constructor (id: SpdxId, op: OptionalSpdxLicenseProperties = {}) {
    super(op)
    this.id = id
  }

  get id (): SpdxId {
    return this.#id
  }

  /**
   * @throws {@link RangeError} if `value` is empy string
   */
  set id (value: SpdxId) {
    if (value === '') {
      throw new RangeError('value is empty string')
    }
    this.#id = value
  }

  compare (other: SpdxLicense): number {
    return this.#id.localeCompare(other.#id) ||
      this.bomRef.compare(other.bomRef)
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
