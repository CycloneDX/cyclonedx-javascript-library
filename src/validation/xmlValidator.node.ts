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

import makeValidator, { type Validator } from '../_optPlug.node/xmlValidator'
import { FILES } from '../resources.node'
import { BaseValidator } from './baseValidator'
import { MissingOptionalDependencyError, NotImplementedError } from './errors'
import type { ValidationError } from './types'
import type * as OptionalFeature from '../_opt'
import { cannotOf } from '../_opt'


export class XmlValidator extends BaseValidator {

  /**
   * Indicates whether this functionality cannot act.
   *
   * `false` if this functionality can act; otherwise, describes which optional dependencies are
   * unavailable and prevent it from doing so.
   */
  static readonly cannot = cannotOf(makeValidator)

  #getSchemaFilePath (): string {
    const s = FILES.CDX.XML_SCHEMA[this.version]
    /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- better be safe */
    if (s === undefined) {
      throw new NotImplementedError(this.version)
    }
    return s
  }

  #validatorCache?: Validator = undefined

  async #getValidator (): Promise<Validator> {
    if (this.#validatorCache === undefined) {
      if (XmlValidator.cannot !== false) throw new MissingOptionalDependencyError(XmlValidator.cannot.message)
      this.#validatorCache = await makeValidator(this.#getSchemaFilePath())
    }
    return this.#validatorCache
  }

  /**
   * Validate the data against CycloneDX spec of `this.version`.
   *
   * Promise completes with one of the following:
   * - `null`, when data was valid
   * - {@link Validation.Types.ValidationError | something} representing the error details, when data was invalid representing the error details, when data was invalid
   *
   * Promise rejects with one of the following:
   * - {@link Validation.NotImplementedError | NotImplementedError}, when there is no validator available for `this.version`
   * - {@link Validation.MissingOptionalDependencyError | MissingOptionalDependencyError}, when a required dependency was not installed
   */
  async validate (data: string): Promise<null | ValidationError> {
    return (await this.#getValidator())(data)
  }
}

XmlValidator satisfies OptionalFeature.Provider
