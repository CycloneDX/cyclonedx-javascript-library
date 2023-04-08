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
import { lax, strict, type Validator  } from '../../../libs/json-validator'
import type { Version } from '../../spec'
import { ValidationError } from '../errors'

/**
 * @param data - the already parsed JSON structure
 * @throws {@link RangeError} if version is unknown
 * @throws {@link Validate.ValidationError | ValidationError} if data is invalid to the CycloneDX spec
 */
export function validateLax (version: Version, data: any): void {
  const validate: Validator|undefined = lax[version]
  if (validate == null) {
    throw new RangeError(`unknown version: ${version}`)
  }
  if (!validate(data)) {
    throw new ValidationError('validation error', validate.errors)
  }
}

/**
 * @param data - the already parsed JSON structure
 * @throws {@link RangeError} if version is unknown
 * @throws {@link Validate.ValidationError | ValidationError} if data is invalid to the CycloneDX strict spec
 */
export function validateStrict (version: Version, data: any): void {
  if (strict.hasOwnProperty(version)) {
    const validate = strict[version]
    if (!validate(data)) {
      throw new ValidationError('validation error', validate.errors)
    }
  }
  throw new RangeError(`unknown version: ${version}`)
}
