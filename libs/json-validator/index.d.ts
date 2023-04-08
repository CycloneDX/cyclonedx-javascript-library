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


/** @see {@link https://ajv.js.org/api.html#validation-errors} */
export declare interface ErrorObject {
  keyword: string
  instancePath: string
  schemaPath: string
  params: object
  propertyName?: string
  message?: string
  schema?: any
  parentSchema?: object
  data?: any
}

export declare interface Validator {
  /**
   * If result is false, then `errors` is not null anymore.
   * @param data - the already parsed JSON structure
   */
  (data: any): boolean

  errors: ErrorObject | null
}

export interface Validators {
  readonly [key: string]: Validator
}

export const lax: Validators;
export const strict: Validators;
