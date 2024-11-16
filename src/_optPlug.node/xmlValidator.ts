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

import type { ValidationError } from '../validation/types'
import opWrapper, { type WillThrow } from './_wrapper'

export type Validator = (data: string) => null | ValidationError
export type Functionality = (schemaPath: string) => Promise<Validator>

export default opWrapper<Functionality>('XmlValidator', [
  /* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-require-imports
     -- needed */

  ['libxmljs2', () => require('./__xmlValidators/libxmljs2').default]
  // ... add others here, pull-requests welcome!

  /* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-require-imports */
]) satisfies Functionality | WillThrow
