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

import { create } from 'xmlbuilder2'
import type { XMLBuilder } from 'xmlbuilder2/lib/interfaces'

import type { SerializerOptions } from '../../serialize/types'
import type { SimpleXml } from '../../serialize/xml/types'
import type { Functionality } from '../xmlStringify'

if (typeof create !== 'function') {
  throw new Error('`create` is not a function')
}

/** @internal */
export default (function (
  rootElement: SimpleXml.Element,
  { space }: SerializerOptions = {}
): string {
  const indent = makeIndent(space)
  const doc = create({ encoding: 'UTF-8' })
  addEle(doc, rootElement)
  return doc.end({
    format: 'xml',
    newline: '\n',
    prettyPrint: indent.length > 0,
    indent
  })
}) satisfies Functionality

function addEle (
  parent: XMLBuilder,
  element: SimpleXml.Element | SimpleXml.Comment,
  parentNS: string | null = null
): void {
  if (element.type !== 'element') {
    return
  }
  const ns = getNS(element) ?? parentNS
  const ele = parent.ele(ns, element.name, element.attributes)
  if (element.children === undefined) {
    /* pass */
  } else if (typeof element.children === 'string' || typeof element.children === 'number') {
    ele.txt(element.children.toString())
  } else {
    for (const child of element.children) {
      addEle(ele, child, ns)
    }
  }
}

function getNS (element: SimpleXml.Element): string | null {
  const ns = (element.namespace ?? element.attributes?.xmlns)?.toString() ?? ''
  return ns.length > 0
    ? ns
    : null
}

function makeIndent (space: string | number | any): string {
  if (typeof space === 'number') {
    return ' '.repeat(Math.max(0, space))
  }
  if (typeof space === 'string') {
    return space
  }
  return ''
}
