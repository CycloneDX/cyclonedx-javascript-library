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

import { readFile } from 'fs/promises'
import type { Document, ParserOptions, parseXml } from 'libxmljs2'
import { pathToFileURL } from 'url'

import { FILES } from '../resources.node'
import { BaseValidator } from './baseValidator'
import { MissingOptionalDependencyError, NotImplementedError } from './errors'
import type { ValidationError } from './types'

let _parser: typeof parseXml | undefined

async function getParser (): Promise<typeof parseXml> {
  if (_parser === undefined) {
    let libxml
    try {
      libxml = await import('libxmljs2')
    } catch (err) {
      throw new MissingOptionalDependencyError(
        'No XML validator available.' +
        ' Please install the optional dependency "libxmljs2".' +
        ' Please make sure the system meets the requirements for "node-gyp", see https://github.com/TooTallNate/node-gyp#installation',
        err
      )
    }
    _parser = libxml.parseXml
  }
  return _parser
}

const xmlParseOptions: Readonly<ParserOptions> = Object.freeze({
  nonet: true,
  compact: true,
  noent: true // prevent https://github.com/CycloneDX/cyclonedx-javascript-library/issues/1061
})

export class XmlValidator extends BaseValidator {
  #schema: Document | undefined

  #getSchemaFile (): string | undefined {
    return FILES.CDX.XML_SCHEMA[this.version]
  }

  async #getSchema (): Promise<Document> {
    if (undefined === this.#schema) {
      const file = this.#getSchemaFile()
      if (file === undefined) {
        throw new NotImplementedError(this.version)
      }
      const [parse, schema] = await Promise.all([
        getParser(),
        readFile(file, 'utf-8')
      ])
      this.#schema = parse(schema, { ...xmlParseOptions, baseUrl: pathToFileURL(file).toString() })
    }
    return this.#schema
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
    const [parse, schema] = await Promise.all([
      getParser(),
      this.#getSchema()
    ])
    const doc = parse(data, xmlParseOptions)
    return doc.validate(schema)
      ? null
      : doc.validationErrors
  }
}
