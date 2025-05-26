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

import CDX from "@cyclonedx/cyclonedx-library"
import {readFile} from 'node:fs/promises';

const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error("missing args");
  process.exit(1);
}
const [filePath] = args
console.debug('filePath', filePath)

const json = await readFile(filePath, 'utf8')
const data = JSON.parse(json);

const CDX_JSON_SCHEMA_RE = /^http:\/\/cyclonedx\.org\/schema\/bom\-(\d+\.\d+)\.schema\.json$/
const specVersion = data['$schema'].match(CDX_JSON_SCHEMA_RE)[1]
const validator = new CDX.Validation.JsonStrictValidator(specVersion)

const validationError = await validator.validate(json)
if (validationError !== null) {
  console.error('validation error', validationError)
  process.exit(2);
}

console.info('valid')
process.exit(0)
