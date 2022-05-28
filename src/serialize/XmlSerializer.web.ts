import { isNotUndefined } from '../helpers/types'
import { SerializerOptions } from './types'
import { XmlBaseSerializer } from './XmlBaseSerializer'
import { SimpleXml } from './XML/types'

/**
 * XML serializer for web browsers.
 */
export class XmlSerializer extends XmlBaseSerializer {
  protected _serialize (
    normalizedBom: SimpleXml.Element,
    { space }: SerializerOptions = {}
  ): string {
    const doc = this.#buildXmlDocument(normalizedBom)
    // TODO: add indention based on `space`
    return (new XMLSerializer()).serializeToString(doc)
  }

  #buildXmlDocument (
    normalizedBom: SimpleXml.Element
  ): XMLDocument {
    const doc = document.implementation.createDocument(null, null)
    doc.appendChild(this.#buildElement(normalizedBom, doc))
    return doc
  }

  #getNs (element: SimpleXml.Element): string | null {
    const ns = (element.namespace ?? element.attributes?.xmlns)?.toString() ?? ''
    return ns.length > 0
      ? ns
      : null
  }

  #buildElement (element: SimpleXml.Element, doc: XMLDocument, parentNS: string | null = null): Element {
    const ns = this.#getNs(element) ?? parentNS
    const node: Element = ns === null
      ? doc.createElement(element.name)
      : doc.createElementNS(ns, element.name)
    if (isNotUndefined(element.attributes)) {
      this.#setAttributes(node, element.attributes)
    }
    if (isNotUndefined(element.children)) {
      this.#setChildren(node, element.children, ns)
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

  #setChildren (node: Element, children: SimpleXml.ElementChildren, parentNS: string | null = null): void {
    const t = typeof children
    if (t === 'string' || t === 'number') {
      node.textContent = `${children as SimpleXml.Text}`
      return
    }

    const doc = node.ownerDocument
    for (const c of (children as Iterable<SimpleXml.Comment | SimpleXml.Element>)) {
      if (c.type === 'element') {
        node.appendChild(this.#buildElement(c, doc, parentNS))
      }
      // comments are not implemented, yet
    }
  }
}
