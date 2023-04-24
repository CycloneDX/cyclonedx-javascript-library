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

import type Ajv from 'ajv'
import { type ValidateFunction } from 'ajv'
import { readFile } from 'fs/promises'

import { FILES } from '../resources.node'
import { BaseValidator } from './baseValidator'
import { MissingOptionalDependencyError, NotImplementedError } from './errors'
import type { ValidationError } from './types'

let _ajv: Ajv | undefined

/**
 * @throws {@link Validation.MissingOptionalDependencyError | MissingOptionalDependencyError}
 */
async function getAjv (): Promise<Ajv> {
  if (_ajv === undefined) {
    let Ajv, addFormats, addFormats2019
    try {
      [Ajv, addFormats, addFormats2019] = await Promise.all([
        import('ajv').then((m) => m.default),
        import('ajv-formats').then((m) => m.default),
        /* @ts-expect-error TS7016 */
        import('ajv-formats-draft2019')
      ])
    } catch (err) {
      throw new MissingOptionalDependencyError(
        'No JSON validator available.' +
        ' Please install all of the optional dependencies:' +
        ' ajv, ajv-formats, ajv-formats-draft2019',
        err
      )
    }

    const [spdxSchema, jsfSchema] = await Promise.all([
      readFile(FILES.SPDX.JSON_SCHEMA, 'utf-8').then(JSON.parse),
      readFile(FILES.JSF.JSON_SCHEMA, 'utf-8').then(JSON.parse)
    ])
    const ajv = new Ajv({
      // no defaults => no data alteration
      useDefaults: false,
      formats: {
        // "string" was mistakenly set as format in CycloneDX1.2
        string: true
      },
      strict: false,
      strictSchema: false,
      addUsedSchema: false,
      schemas: {
        'http://cyclonedx.org/schema/spdx.SNAPSHOT.schema.json': spdxSchema,
        'http://cyclonedx.org/schema/jsf-0.82.SNAPSHOT.schema.json': jsfSchema
      }
    })
    addFormats(ajv)
    addFormats2019(ajv, { formats: ['idn-email'] })
    // there is just no working implementation for format "iri-reference": see https://github.com/luzlab/ajv-formats-draft2019/issues/22
    ajv.addFormat('iri-reference', true)
    _ajv = ajv
  }
  return _ajv
}

abstract class BaseJsonValidator extends BaseValidator {
  #validator: ValidateFunction | undefined

  /** @internal */
  protected abstract _getSchemaFile (): string | undefined

  async #getValidator (): Promise<ValidateFunction> {
    if (this.#validator === undefined) {
      const schemaFile = this._getSchemaFile()
      if (schemaFile === undefined) {
        throw new NotImplementedError(this.version)
      }
      const [ajv, schema] = await Promise.all([
        getAjv(),
        readFile(schemaFile, 'utf-8').then(JSON.parse)
      ])
      this.#validator = ajv.compile(schema)
    }
    return this.#validator
  }

  /**
   * Validate the data against CycloneDX spec of `this.version`.
   *
   * Promise completes with null, if no errors occurred.
   * Promise completes with non-null, representing the error details.
   *
   * Promise rejects with one of the following:
   * - {@link Validation.NotImplementedError | NotImplementedError} when there is no validator available for `this.version`
   * - {@link Validation.MissingOptionalDependencyError | MissingOptionalDependencyError} when a required dependency was not installed
   */
  async validate (data: string): Promise<null | ValidationError> {
    const [doc, validator] = await Promise.all([
      (async () => JSON.parse(data))(),
      this.#getValidator()
    ])
    return validator(doc)
      ? null
      : validator.errors
  }
}
export class JsonValidator extends BaseJsonValidator {
  /** @internal */
  protected _getSchemaFile (): string | undefined {
    return FILES.CDX.JSON_SCHEMA[this.version]
  }
}

export class JsonStrictValidator extends BaseJsonValidator {
  /** @internal */
  protected _getSchemaFile (): string | undefined {
    return FILES.CDX.JSON_STRICT_SCHEMA[this.version]
  }
}
