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
import type LibXml from 'libxmljs'
import type { parseXmlAsync, XMLDocument, XMLParseOptions } from 'libxmljs'
import { pathToFileURL } from 'url'

import { FILES } from '../../resources.node'
import { MissingOptionalDependencyError, NotImplementedError, ValidationError } from '../errors'
import { BaseValidator } from './_helpers'

let _parser: typeof parseXmlAsync | undefined

async function importLibXml (): Promise<typeof LibXml> {
  try {
    return await import('libxmljs')
  } catch {
    throw new MissingOptionalDependencyError(
      'No XML validator available.' +
        ' Please install the optional libraries "libxmljs".' +
        ' Please make sure you have met the requirements for node-gyp. https://github.com/TooTallNate/node-gyp#installation'
    )
  }
}

async function getParser (): Promise<typeof parseXmlAsync> {
  if (_parser === undefined) {
    const parser = await importLibXml().then(({ parseXmlAsync }) => parseXmlAsync)
    _parser = parser
  }
  return _parser
}

let _xmlParseOptions: XMLParseOptions | undefined

async function getXmlParseOptions (): Promise<XMLParseOptions> {
  if (_xmlParseOptions === undefined) {
    const XMLParseFlags = await importLibXml().then(({ XMLParseFlags }) => XMLParseFlags)
    _xmlParseOptions = {
      flags: [
        XMLParseFlags.XML_PARSE_NONET,
        XMLParseFlags.XML_PARSE_COMPACT
      ]
    }
  }
  return _xmlParseOptions
}

export class XmlValidator extends BaseValidator {
  #schema: XMLDocument | undefined

  #getSchemaFile (): string | undefined {
    return FILES.CDX.XML_SCHEMA[this.version]
  }

  async #getSchema (): Promise<XMLDocument> {
    if (undefined === this.#schema) {
      const file = this.#getSchemaFile()
      if (file === undefined) {
        throw new NotImplementedError(`not implemented for version: ${this.version}`)
      }
      const [parse, schema, xmlParseOptions] = await Promise.all([
        getParser(),
        readFile(file),
        getXmlParseOptions()
      ])
      this.#schema = await parse(schema, { ...xmlParseOptions, url: pathToFileURL(file).toString() })
    }
    return this.#schema
  }

  /**
   * Promise rejects with one of the following
   * - {@link Validation.NotImplementedError | NotImplementedError} when there is no validator available for `this.version`
   * - {@link Validation.MissingOptionalDependencyError | MissingOptionalDependencyError} when a required dependency was not installed
   * - {@link Validation.ValidationError | ValidationError} when `data` was invalid to the schema
   */
  async validate (data: string): Promise<void> {
    const [parse, xmlParseOptions, schema] = await Promise.all([
      getParser(),
      getXmlParseOptions(),
      this.#getSchema()
    ])
    const doc = await parse(data, xmlParseOptions)
    if (doc.validate(schema) !== true) {
      throw new ValidationError(`invalid to CycloneDX ${this.version}`, doc.validationErrors)
    }
  }
}
