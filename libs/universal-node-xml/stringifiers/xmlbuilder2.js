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

const { create } = require('xmlbuilder2')
const { getNS, makeIndent } = require('./_helpers')

module.exports = typeof create === 'function'
  ? stringify
  /* c8 ignore next */
  : undefined

/* eslint-disable jsdoc/valid-types */

/**
 * @typedef {import('xmlbuilder2/lib/interfaces').XMLBuilder} XMLBuilder
 */

/**
 * @typedef {import('../../../src/serialize/xml/types').SimpleXml.Element} Element
 */

/* eslint-enable jsdoc/valid-types */

/**
 * @param {Element} element
 * @param {string|number|undefined} [space]
 * @return {string}
 */
function stringify (element, { space } = {}) {
  const indent = makeIndent(space)
  const doc = create({ encoding: 'UTF-8' })
  addEle(doc, element)
  return doc.end({
    format: 'xml',
    newline: '\n',
    prettyPrint: indent.length > 0,
    indent
  })
}

/**
 * @param {XMLBuilder} parent
 * @param {Element} element
 * @param {string|null} [parentNS=null]
 */
function addEle (parent, element, parentNS = null) {
  if (element.type !== 'element') { return }
  const ns = getNS(element) ?? parentNS
  const ele = parent.ele(ns, element.name, element.attributes)
  if (typeof element.children === 'string' || typeof element.children === 'number') {
    ele.txt(element.children.toString())
  } else if (Array.isArray(element.children)) {
    for (const child of element.children) {
      addEle(ele, child, ns)
    }
  }
}
