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
   * @throws {RangeError} if expression is not eligible
   */
  constructor (expression: string) {
    this.expression = expression
  }

  get expression (): string {
    return this.#expression
  }

  /**
   * @throws {RangeError} if expression is not eligible
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

  constructor (name: string, op: NamedLicenseOptionalProperties = {}) {
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
   * @throws {RangeError} if value is not supported SPDX id
   */
  constructor (id: SpdxId, op: SpdxLicenseOptionalProperties = {}) {
    this.id = id
    this.text = op.text
    this.url = op.url
  }

  get id (): SpdxId {
    return this.#id
  }

  /**
   * @throws {RangeError} if value is not supported SPDX id
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
  static compareItems (a: License, b: License): number {
    if (a.constructor === b.constructor) {
      // @ts-expect-error -- classes are from same type -> they are comparable
      return a.compare(b)
    }
    return a.constructor.name.localeCompare(b.constructor.name)
  }
}
