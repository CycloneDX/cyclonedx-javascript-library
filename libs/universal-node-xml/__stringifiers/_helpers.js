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

/* eslint-disable jsdoc/valid-types */

/**
 * @typedef {import('../../../src/serialize/xml/types').SimpleXml.Element} Element
 */

/* eslint-enable jsdoc/valid-types */

/**
 * @param {Element} element
 * @return {string|string|null}
 */
module.exports.getNS = function (element) {
  const ns = (element.namespace ?? element.attributes?.xmlns)?.toString() ?? ''
  return ns.length > 0
    ? ns
    : null
}

/**
 * @param {string|number|*} [space]
 * @return {string}
 */
module.exports.makeIndent = function (space) {
  if (typeof space === 'number') {
    return ' '.repeat(Math.max(0, space))
  }
  if (typeof space === 'string') {
    return space
  }
  return ''
}
