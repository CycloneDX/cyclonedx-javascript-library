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

import type { DisjunctiveLicense, License } from '../models/license'
import { LicenseExpression, NamedLicense, SpdxLicense } from '../models/license'
import { fixupSpdxId, isValidSpdxLicenseExpression } from '../spdx'

export class LicenseFactory {
  makeFromString (value: string): License {
    try {
      return this.makeSpdxLicense(value)
    } catch {
      /* pass */
    }

    try {
      return this.makeExpression(value)
    } catch {
      /* pass */
    }

    return this.makeNamedLicense(value)
  }

  /**
   * @throws {@link RangeError} if expression is not eligible
   */
  makeExpression (value: string | any): LicenseExpression {
    const expression = String(value)
    if (isValidSpdxLicenseExpression(expression)) {
      return new LicenseExpression(expression)
    }
    throw new RangeError('Invalid SPDX license expression')
  }

  makeDisjunctive (value: string): DisjunctiveLicense {
    try {
      return this.makeSpdxLicense(value)
    } catch {
      return this.makeNamedLicense(value)
    }
  }

  /**
   * @throws {@link RangeError} if value is not supported SPDX id
   */
  makeSpdxLicense (value: string | any): SpdxLicense {
    const fixed = fixupSpdxId(String(value))
    if (undefined === fixed) {
      throw new RangeError('Unsupported SPDX license ID')
    }

    return new SpdxLicense(fixed)
  }

  makeNamedLicense (value: string | any): NamedLicense {
    return new NamedLicense(String(value))
  }
}
