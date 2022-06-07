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

const { create } = require('xmlbuilder2')
const { getNS, makeIndent } = require('./helpers')

module.exports = typeof create === 'function'
  ? stringify
  : undefined

function stringify (element, { space } = {}) {
  const indent = makeIndent(space)
  const doc = create()
  addEle(doc, element)
  return doc.end({
    format: 'xml',
    prettyPrint: indent.length > 0,
    indent
  })
}

function addEle (parent, element, parentNS) {
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
