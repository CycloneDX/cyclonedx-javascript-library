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

import { readFile } from 'node:fs/promises'

import Ajv, { type Options as AjvOptions } from 'ajv'
import addFormats from 'ajv-formats'

import type { ValidationError } from '../../validation/types'
import type { Functionality, Validator } from '../jsonValidator'

const ajvOptions: Readonly<AjvOptions> = Object.freeze({
  // no defaults => no data alteration
  useDefaults: false,
  strict: false,
  strictSchema: false,
  addUsedSchema: false,
  loadSchema: (uri: string) => { throw new Error(`Remote schemas are disabled: ${uri}`) }
} satisfies AjvOptions)

/** @internal */
export default (async function (schemaPath: string, schemaMap: Record<string, string> = {}): Promise<Validator> {
  /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return -- intended */
  const [schema, schemas] = await Promise.all([
    readFile(schemaPath, 'utf-8').then(c => JSON.parse(c)),
    Promise.all(Object.entries(schemaMap).map(
      async ([k, v]) => await readFile(v, 'utf-8').then(c => [k, JSON.parse(c)])
    )).then(es => Object.fromEntries(es))
  ])
  /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return  */

  /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- intended */
  const ajv = new Ajv({ ...ajvOptions, schemas })
  addFormats(ajv)

  // there is just no working implementation for format "iri-reference": see https://github.com/luzlab/ajv-formats-draft2019/issues/22
  ajv.addFormat('iri-reference', true)

  // add idn-email format (was previously provided by ajv-formats-draft2019)
  const emailValidator = ajv.compile({type: 'string', format: 'email'})
  ajv.addFormat('idn-email', {
    type: 'string',
    // syntax allows non-ASCII characters in places where 'x' would be allowed
    // (don't attempt to validate exactly which Unicode characters are OK - too complex)
    validate: x => emailValidator(x.replace(/[\u0080-\uffff]+/g, 'x'))
  })

  const validator = ajv.compile(schema)

  return function (data: string): null | ValidationError {
    return validator(JSON.parse(data))
      ? null
      : validator.errors
  }
}) satisfies Functionality
