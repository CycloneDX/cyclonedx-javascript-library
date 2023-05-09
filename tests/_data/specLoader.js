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

const resPath = path.resolve(__dirname, '..', '..', 'res', 'schema')

/**
 * @param {string} resourceFile
 * @returns {*}
 * @throws {Error} if parsing the `resourceFile` failed somehow
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
 * @returns {*}
 * @throws {TypeError} if resolving the `path` failed
 * @throws {Error} if parsing the `resourceFile` failed somehow
 */
function getSpecElement (resourceFile, ...path) {
  let element = loadSpec(resourceFile)
  for (const segment of path) {
    element = element[segment]
    if (undefined === element) {
      throw TypeError(`undefined element: ${resourceFile}#${path.join('.')}`)
    }
  }
  return element
}

/**
 * @param {string} resourceFile
 * @param {string} path
 * @returns {Array<number|string>}
 * @throws {TypeError} if resolved `path` is not non-empty-list
 * @throws {TypeError} if resolving the `path` failed
 * @throws {Error} if parsing the `resourceFile` failed somehow
 */
function getSpecEnum (resourceFile, ...path) {
  const element = getSpecElement(
    resourceFile,
    'definitions', ...path, 'enum')
  if (!Array.isArray(element) || element.length === 0) {
    throw TypeError(`did not resolve non-empty-list for: ${resourceFile}#${path.join('.')}`)
  }
  return element
}

module.exports = {
  loadSpec,
  getSpecElement,
  getSpecEnum
}
