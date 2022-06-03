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

const fs = require('fs')
const path = require('path')

const resPath = path.resolve(__dirname, '..', '..', 'res')

/**
 * @param {string} resourceFile
 * @return {*}
 */
function loadSpec (resourceFile) {
  return JSON.parse(
    fs.readFileSync(
      path.resolve(resPath, resourceFile)
    )
  )
}

/**
 * @param {string} resourceFile
 * @param {string} path
 * @return {*}
 */
function getSpecElement (resourceFile, ...path) {
  let element = loadSpec(resourceFile)
  for (const segment of path) {
    element = element[segment]
  }
  return element
}

/**
 * @param {string} resourceFile
 * @param {string} path
 * @return {Array<number|string>}
 */
function getSpecEnum (resourceFile, ...path) {
  return getSpecElement(resourceFile, 'definitions', ...path, 'enum')
}

module.exports = {
  loadSpec: loadSpec,
  getSpecElement: getSpecElement,
  getSpecEnum: getSpecEnum
}
