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
import { pathToFileURL } from 'node:url'

import { type ParserOptions, parseXml } from 'libxmljs2'

import type { ValidationError } from '../../validation/types'
import type { Functionality, Validator } from '../xmlValidator'

const xmlParseOptions: Readonly<ParserOptions> = Object.freeze({
  nonet: true,
  compact: true,
  // explicitly prevent XXE
  // see https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html
  // see https://github.com/CycloneDX/cyclonedx-javascript-library/issues/1061
  noent: false,
  dtdload: false
})

/** @internal */
export default (async function (schemaPath: string): Promise<Validator> {
  const schema = parseXml(await readFile(schemaPath, 'utf-8'),
    { ...xmlParseOptions, baseUrl: pathToFileURL(schemaPath).toString() })

  return function (data: string): null | ValidationError {
    const doc = parseXml(data, xmlParseOptions)
    return doc.validate(schema)
      ? null
      : doc.validationErrors
  }
}) satisfies Functionality
