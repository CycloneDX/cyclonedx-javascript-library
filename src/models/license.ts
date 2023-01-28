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

import { Sortable } from '../_helpers/sortable'
import { isSupportedSpdxId, SpdxId } from '../spdx'
import { Attachment } from './attachment'

export class LicenseExpression {
  static isEligibleExpression (expression: string | any): boolean {
    // smallest known: (A or B)
    // TODO: use a better detection - maybe validate via https://www.npmjs.com/package/spdx-expression-parse
    return typeof expression === 'string' &&
      expression.length >= 8 &&
      expression[0] === '(' &&
      expression[expression.length - 1] === ')'
  }

  /** @see expression */
  #expression!: string

  /**
   * @throws {RangeError} if `expression` is not {@link LicenseExpression.isEligibleExpression eligible}
   */
  constructor (expression: LicenseExpression['expression']) {
    this.expression = expression
  }

  get expression (): string {
    return this.#expression
  }

  /**
   * @throws {RangeError} if value is not {@link LicenseExpression.isEligibleExpression eligible}
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

export interface OptionalNamedLicenseProperties {
  text?: NamedLicense['text']
  url?: NamedLicense['url']
}

export class NamedLicense {
  name: string
  text?: Attachment
  url?: URL | string

  constructor (name: NamedLicense['name'], op: OptionalNamedLicenseProperties = {}) {
    this.name = name
    this.text = op.text
    this.url = op.url
  }

  compare (other: NamedLicense): number {
    return this.name.localeCompare(other.name)
  }
}

export interface OptionalSpdxLicenseProperties {
  text?: SpdxLicense['text']
  url?: SpdxLicense['url']
}

export class SpdxLicense {
  text?: Attachment
  url?: URL | string

  /** @see id */
  #id!: SpdxId

  /**
   * @throws {RangeError} if `id` is not {@link isSupportedSpdxId supported}
   */
  constructor (id: SpdxLicense['id'], op: OptionalSpdxLicenseProperties = {}) {
    this.id = id
    this.text = op.text
    this.url = op.url
  }

  get id (): SpdxId {
    return this.#id
  }

  /**
   * @throws {RangeError} if value is not {@link isSupportedSpdxId supported}
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
