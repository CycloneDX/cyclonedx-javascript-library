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

import { isNotUndefined } from '../_helpers/notUndefined'
import type { SerializerOptions } from './types'
import type { SimpleXml } from './xml/types'
import { XmlBaseSerializer } from './xmlBaseSerializer'

/**
 * XML serializer for web browsers.
 */
export class XmlSerializer extends XmlBaseSerializer {
  protected _serialize (
    normalizedBom: SimpleXml.Element,
    { space }: SerializerOptions = {}
  ): string {
    const doc = this.#buildXmlDocument(normalizedBom)
    // @TODO: add indention based on `space`
    return (new XMLSerializer()).serializeToString(doc)
  }

  #buildXmlDocument (
    rootElement: SimpleXml.Element
  ): XMLDocument {
    const namespace = null
    const doc = document.implementation.createDocument(namespace, null)
    doc.appendChild(this.#buildElement(rootElement, doc, namespace))
    return doc
  }

  #getNS (element: SimpleXml.Element): string | null {
    const ns = (element.namespace ?? element.attributes?.xmlns)?.toString() ?? ''
    return ns.length > 0
      ? ns
      : null
  }

  #buildElement (element: SimpleXml.Element, doc: XMLDocument, parentNS: string | null): Element {
    const ns = this.#getNS(element) ?? parentNS
    const node: Element = doc.createElementNS(ns, element.name)
    if (isNotUndefined(element.attributes)) {
      this.#setAttributes(node, element.attributes)
    }
    if (isNotUndefined(element.children)) {
      this.#addChildren(node, element.children, ns)
    }
    return node
  }

  #setAttributes (node: Element, attributes: SimpleXml.ElementAttributes): void {
    for (const [name, value] of Object.entries(attributes)) {
      if (isNotUndefined(value) && name !== 'xmlns') {
        // reminder: cannot change a namespace(xmlns) after the fact.
        node.setAttribute(name, `${value}`)
      }
    }
  }

  #addChildren (node: Element, children: SimpleXml.ElementChildren, parentNS: string | null = null): void {
    if (children === undefined) {
      return
    }

    if (typeof children === 'string' || typeof children === 'number') {
      node.textContent = children.toString()
      return
    }

    const doc = node.ownerDocument
    for (const child of children) {
      if (child.type === 'element') {
        node.appendChild(this.#buildElement(child, doc, parentNS))
      }
      // comments are not implemented, yet
    }
  }
}
