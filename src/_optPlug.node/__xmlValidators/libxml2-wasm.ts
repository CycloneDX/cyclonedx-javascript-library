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

import { readFile } from 'fs/promises';
import { ParseOption, XmlDocument, XsdValidator } from 'libxml2-wasm';
import { pathToFileURL } from 'url';

import type { ValidationError } from '../../validation/types';
import type { Functionality, Validator } from '../xmlValidator';

/** @internal */
export default (async function (schemaPath: string): Promise<Validator> {
  const options = ParseOption.XML_PARSE_NONET | ParseOption.XML_PARSE_COMPACT;
  const schema = XmlDocument.fromString(
    await readFile(schemaPath, 'utf-8'),
    {
      option: options,
      url: pathToFileURL(schemaPath).toString()
    });
  const validator = XsdValidator.fromDoc(schema);

  return function (data: string): null | ValidationError {
    const doc = XmlDocument.fromString(data, { option: options });
    let errors = null;
    try {
      validator.validate(doc);
    }
    catch (validationErrors) {
      errors = validationErrors;
    }

    doc.dispose();

    return errors;
  }
}) satisfies Functionality
