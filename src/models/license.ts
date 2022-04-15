import { isSupportedSpdxId, SpdxId } from '../SPDX'
import { Attachment } from './attachment'

export function isEligibleLicenseExpression (expression: string | any): boolean {
  // smallest known: (A or B)
  return typeof expression === 'string' &&
        expression.length >= 8 &&
        expression[0] === '(' &&
        expression[expression.length - 1] === ')'
}

export class LicenseExpression {
  /**
   * @throws {RangeError} if expression is not eligible
   */
  constructor (expression: string) {
    this.expression = expression
  }

    #expression!: string
    get expression (): string {
      return this.#expression
    }

    /**
     * @throws {RangeError} if expression is not eligible
     */
    set expression (value: string) {
      if (!isEligibleLicenseExpression(value)) {
        throw new RangeError(`Not eligible license expression: ${value}`)
      }
      this.#expression = value
    }
}

export class NamedLicense {
  name: string
  text: Attachment | null = null
  url: URL | null = null

  constructor (name: string) {
    this.name = name
  }
}

export class SpdxLicense {
  text: Attachment | null = null
  url: URL | null = null

  /**
   * @throws {RangeError} if value is not supported SPDX id
   */
  constructor (id: SpdxId) {
    this.id = id
  }

    #id!: SpdxId
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
}

export type DisjunctiveLicense = NamedLicense | SpdxLicense
export type License = DisjunctiveLicense | LicenseExpression

export class LicenseRepository extends Set<License> {
}
