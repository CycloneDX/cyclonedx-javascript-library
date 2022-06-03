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
Copyright (c) Steve Springett. All Rights Reserved.
*/

import { DisjunctiveLicense, License, LicenseExpression, NamedLicense, SpdxLicense } from '../models'
import { fixupSpdxId } from '../spdx'

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
      throw new RangeError('Unsupported SPDX id')
    }

    return new SpdxLicense(spdxId)
  }

  makeDisjunctiveWithName (value: string | any): NamedLicense {
    return new NamedLicense(String(value))
  }
}
