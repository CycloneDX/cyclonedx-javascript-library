import { DisjunctiveLicense, License, LicenseExpression, NamedLicense, SpdxLicense } from './Models.License'
import { fixupSpdxId } from './SPDX'

export class LicenseFactory {
  makeFromString (value: string): License {
    try {
      return this.makeExpression(value)
    } catch (Error) {
      return this.makeDisjunctive(value)
    }
  }

  /**
   * @throws {RangeError} if expression is not eligible
   */
  makeExpression (value: string): LicenseExpression {
    return new LicenseExpression(value)
  }

  makeDisjunctive (value: string): DisjunctiveLicense {
    try {
      return this.makeDisjunctiveWithId(value)
    } catch (error) {
      return this.makeDisjunctiveWithName(value)
    }
  }

  /**
   * @throws {RangeError} if value is not supported SPDX id
   */
  makeDisjunctiveWithId (value: string | any): SpdxLicense {
    const spdxId = fixupSpdxId(String(value))
    if (undefined === spdxId) {
      throw new RangeError('Unknown SPDX id')
    }

    return new SpdxLicense(spdxId)
  }

  makeDisjunctiveWithName (value: string | any): NamedLicense {
    return new NamedLicense(String(value))
  }
}
