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

import {MissingOptionalDependencyError, NotImplementedError, ValidationError} from '../errors'
import {BaseValidator} from './_helpers'
import {parseXmlAsync, XMLDocument, XMLParseFlags, XMLParseOptions} from "libxmljs"
import {FILES} from "../../resources.node";
import {readFile} from "fs/promises";


let _parser: typeof parseXmlAsync | undefined

async function getParser(): Promise<typeof parseXmlAsync> {
  if (_parser === undefined) {
    try {
      _parser = await import('libxmljs').then(({parseXmlAsync}) => parseXmlAsync)
    } catch {
      throw new MissingOptionalDependencyError(
        'No XML validator available.' +
        ' Please install all of the optional libraries:' +
        ' libxmljs'
      )
    }
  }
  return _parser!
}

const xmlParseOptions: XMLParseOptions = {
  flags: [
    XMLParseFlags.XML_PARSE_NONET,
    XMLParseFlags.XML_PARSE_COMPACT
  ]
}

export class XmlValidator extends BaseValidator {

  #schema: XMLDocument | undefined

  #getSchemaFile(): string | undefined {
    return FILES.CDX.XML_SCHEMA[this.version]
  }

  async #getSchema(): Promise<XMLDocument> {
    if (undefined === this.#schema) {
      const file = this.#getSchemaFile()
      if (file === undefined) {
        throw new NotImplementedError(`not implemented for version: ${this.version}`)
      }
      const [parse, schema]  = await Promise.all([
        getParser(),
        readFile(file)
      ])
      this.#schema = await parse(schema, {...xmlParseOptions, url: `file://${file}`})
    }
    return this.#schema
  }

  /**
   * Promise rejects with {@link Validation.ValidationError | ValidationError}
   */
  async validate(data: string): Promise<void> {
    const [doc, schema] = await Promise.all([
      getParser().then(parse => parse(data, xmlParseOptions)),
      this.#getSchema()
    ])
    if (!doc.validate(schema)) {
      throw new ValidationError(`invalid to CycloneDX ${this.version}`, doc.validationErrors)
    }
  }
}
