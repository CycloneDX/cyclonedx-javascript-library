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

'use strict'

/**
 *
 * @see https://ajv.js.org/standalone.html#generating-using-the-js-library
 */

const { writeFileSync } = require('fs')
const { join } = require('path')
const Ajv = require('ajv')
const standaloneCode = require('ajv/dist/standalone')
const addFormats = require('ajv-formats')
const addFormats2019 = require('ajv-formats-draft2019')

function generate (fileBase, specs) {
  const ajv = new Ajv({
    schemas: {
      ...specs,
      'http://cyclonedx.org/schema/jsf-0.82.SNAPSHOT.schema.json': require('../../res/schema/jsf-0.82.SNAPSHOT.schema.json'),
      'http://cyclonedx.org/schema/spdx.SNAPSHOT.schema.json': require('../../res/schema/spdx.SNAPSHOT.schema.json')
    },
    strict: false,
    strictSchema: false,
    code: { source: true }
  })
  addFormats(ajv)
  addFormats2019(ajv)

  writeFileSync(
    `${fileBase}.cjs`,
    standaloneCode(
      ajv,
      Object.fromEntries(Object.keys(specs).map(k => [k, k]))
    )
  )
  writeFileSync(
    `${fileBase}.d.ts`,
    `
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
  (data:any): boolean
  errors: ErrorObject | null
}

declare const validators: { readonly [key: string]: Validator | undefined };

/** @internal */
export default validators;`
  )
}

const TARGET_DIR = join(__dirname, '..', '..', 'src', 'validate', 'validators', '_generated')

generate(join(TARGET_DIR, 'json'), {
  1.4: require('../../res/schema/bom-1.4.SNAPSHOT.schema.json'),
  1.3: require('../../res/schema/bom-1.3.SNAPSHOT.schema.json'),
  1.2: require('../../res/schema/bom-1.2.SNAPSHOT.schema.json')
})
generate(join(TARGET_DIR, 'json-strict'), {
  1.4: require('../../res/schema/bom-1.4.SNAPSHOT.schema.json'),
  1.3: require('../../res/schema/bom-1.3-strict.SNAPSHOT.schema.json'),
  1.2: require('../../res/schema/bom-1.2-strict.SNAPSHOT.schema.json')
})
