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

import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { readFileSync } from 'fs'

import { FILES } from '../../resources.node'
import { ValidationError } from '../errors'
import { BaseValidator } from './_helpers'

export class JsonValidator extends BaseValidator {
  /**
   * @throws {@link Validation.ValidationError | ValidationError} in case of validation errors
   */
  validate (data: any): void {
    const file = FILES.CDX.JSON_SCHEMA[this.version]
    if (file === undefined) {
      throw new ValidationError(`not implemented for version: ${this.version}`)
    }
    const ajv = new Ajv()
    addFormats(ajv)
    const validator = ajv.compile(JSON.parse(readFileSync(file, 'utf-8')))
    if (!validator(data)) {
      throw new ValidationError(`invalid to CycloneDX ${this.version}`, validator.errors)
    }
  }
}

export class JsonStrictValidator extends BaseValidator {
  /**
   * @throws {@link Validation.ValidationError | ValidationError} in case of validation errors
   */
  validate (data: any): void {
    const file = FILES.CDX.JSON_STRICT_SCHEMA[this.version]
    if (file === undefined) {
      throw new ValidationError(`not implemented for version: ${this.version}`)
    }
    const ajv = new Ajv()
    addFormats(ajv)
    const validator = ajv.compile(JSON.parse(readFileSync(file, 'utf-8')))
    if (!validator(data)) {
      throw new ValidationError(`invalid to CycloneDX ${this.version}`, validator.errors)
    }
  }
}
