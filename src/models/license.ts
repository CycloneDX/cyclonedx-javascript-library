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

import { isSupportedSpdxId, SpdxId } from '../spdx'
import { Attachment } from './attachment'

export class LicenseExpression {
  static isEligibleExpression (expression: string | any): boolean {
    // smallest known: (A or B)
    return typeof expression === 'string' &&
      expression.length >= 8 &&
      expression[0] === '(' &&
      expression[expression.length - 1] === ')'
  }

  /** @see expression */
  #expression!: string

  /**
   * @throws {RangeError} if {@see expression} is not eligible({@see LicenseExpression.isEligibleExpression})
   */
  constructor (expression: LicenseExpression['expression']) {
    this.expression = expression
  }

  get expression (): string {
    return this.#expression
  }

  /**
   * @throws {RangeError} if expression is not eligible({@see LicenseExpression.isEligibleExpression})
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

interface NamedLicenseOptionalProperties {
  text?: NamedLicense['text']
  url?: NamedLicense['url']
}

export class NamedLicense {
  name: string
  text?: Attachment
  url?: URL | string

  constructor (name: NamedLicense['name'], op: NamedLicenseOptionalProperties = {}) {
    this.name = name
    this.text = op.text
    this.url = op.url
  }

  compare (other: NamedLicense): number {
    return this.name.localeCompare(other.name)
  }
}

interface SpdxLicenseOptionalProperties {
  text?: SpdxLicense['text']
  url?: SpdxLicense['url']
}

export class SpdxLicense {
  text?: Attachment
  url?: URL | string

  /** @see id */
  #id!: SpdxId

  /**
   * @throws {RangeError} if {@see id} is not supported SPDX id({@see isSupportedSpdxId})
   */
  constructor (id: SpdxLicense['id'], op: SpdxLicenseOptionalProperties = {}) {
    this.id = id
    this.text = op.text
    this.url = op.url
  }

  get id (): SpdxId {
    return this.#id
  }

  /**
   * @throws {RangeError} if value is not supported SPDX id({@see isSupportedSpdxId})
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

export class LicenseRepository extends Set<License> {
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
