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

import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/* eslint-disable no-unused-vars */

const SOURCE_ROOT = 'https://raw.githubusercontent.com/CycloneDX/specification/v1.5-dev/schema/'
const TARGET_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'res', 'schema')

const BomXsd = Object.freeze({
  versions: ['1.5', '1.4', '1.0', '1.1', '1.2', '1.3'],
  sourcePattern: `${SOURCE_ROOT}bom-%s.xsd`,
  targetPattern: join(TARGET_ROOT, 'bom-%s.SNAPSHOT.xsd'),
  replace: Object.freeze([
    [/schemaLocation="https?:\/\/cyclonedx.org\/schema\/spdx"/g, 'schemaLocation="spdx.SNAPSHOT.xsd"']
  ])
})

const bomSchemaEnumMatch = /("\$id": "(http:\/\/cyclonedx\.org\/schema\/bom.+?\.schema\.json)".*"enum": \[\s+")http:\/\/cyclonedx\.org\/schema\/bom.+?\.schema\.json"/sg
const bomSchemaEnumReplace = '$1$2"'

const bomRequired = `
  "required": [
    "bomFormat",
    "specVersion",
    "version"
  ],`
const bomRequiredReplace = `
  "required": [
    "bomFormat",
    "specVersion"
  ],`

const defaultWithPatternMatch = /\s+"default": "",(?![^}]*?"pattern": "\^\(\.\*\)\$")/gm
const defaultWithPatternReplace = ''

const BomJsonLax = Object.freeze({
  versions: ['1.5', '1.4', '1.3', '1.2'],
  sourcePattern: `${SOURCE_ROOT}bom-%s.schema.json`,
  targetPattern: join(TARGET_ROOT, 'bom-%s.SNAPSHOT.schema.json'),
  replace: Object.freeze([
    Object.freeze(['spdx.schema.json', 'spdx.SNAPSHOT.schema.json']),
    Object.freeze(['jsf-0.82.schema.json', 'jsf-0.82.SNAPSHOT.schema.json']),
    Object.freeze([bomSchemaEnumMatch, bomSchemaEnumReplace]),
    Object.freeze([bomRequired, bomRequiredReplace])
    // with current SchemaValidator this is no longer required: defaultWithPatternMatch -> defaultWithPatternReplace
    // Object.freeze([defaultWithPatternMatch, defaultWithPatternReplace])
  ])
})

const BomJsonStrict = Object.freeze({
  versions: ['1.2', '1.3'],
  sourcePattern: `${SOURCE_ROOT}bom-%s-strict.schema.json`,
  targetPattern: join(TARGET_ROOT, 'bom-%s-strict.SNAPSHOT.schema.json'),
  replace: BomJsonLax.replace
})

const OtherDownloadables = Object.freeze(Object.fromEntries([
  [`${SOURCE_ROOT}spdx.schema.json`, join(TARGET_ROOT, 'spdx.SNAPSHOT.schema.json')],
  [`${SOURCE_ROOT}spdx.xsd`, join(TARGET_ROOT, 'spdx.SNAPSHOT.xsd')],
  [`${SOURCE_ROOT}jsf-0.82.schema.json`, join(TARGET_ROOT, 'jsf-0.82.SNAPSHOT.schema.json')]
]))

const FetchOptions = Object.freeze({ mode: 'no-cors' })

for (const dSpec of [BomXsd, BomJsonLax, BomJsonStrict]) {
  for (const version of dSpec.versions) {
    const source = dSpec.sourcePattern.replace('%s', String(version))
    const target = dSpec.targetPattern.replace('%s', String(version))
    fetch(source, FetchOptions).then(res => res.text()).then(
      /** @param {string} text */
      text => new Promise((resolve, reject) => {
        for (const [searchValue, replaceValue] of dSpec.replace) {
          text = text.replaceAll(searchValue, replaceValue)
        }
        resolve(text)
      })).then(text => writeFile(target, text))
  }
}

for (const [source, target] of Object.entries(OtherDownloadables)) {
  fetch(source, FetchOptions).then(res => res.text()).then(text => writeFile(target, text))
}
