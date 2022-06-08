'use strict'
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

/** @typedef {import('../../src/spec').Version} Version */

/**
 * @param {string} purpose
 * @param {Version} spec
 * @param {string} format
 * @param {BufferEncoding} [encoding]
 * @returns {string}
 */
module.exports.loadNormalizeResult = function (purpose, spec, format, encoding = 'utf-8') {
  return fs.readFileSync(
    path.resolve(__dirname, 'normalizeResults', `${purpose}_spec${spec}.${format}`)
  ).toString(encoding)
}

/**
 * @param {string} data
 * @param {string} purpose
 * @param {Version} spec
 * @param {string} format
 */
module.exports.writeNormalizeResult = function (data, purpose, spec, format) {
  return fs.writeFileSync(
    path.resolve(__dirname, 'normalizeResults', `${purpose}_spec${spec}.${format}`),
    data
  )
}
