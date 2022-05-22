import { SimpleXml } from '../serialize/XML/types'
import { isNotUndefined } from './types'
import { SerializeOptions } from '../serialize/types'

const isAvailable: boolean = typeof Document === 'function' &&
    typeof XMLSerializer === 'function'

type Protocol = (e: SimpleXml.Element, o: SerializeOptions) => string

export const stringify: Protocol | undefined = isAvailable
  ? serialize
  : undefined

function serialize (element: SimpleXml.Element, options: SerializeOptions): string {
  const doc = new Document()
  doc.appendChild(buildElement(element, doc))
  return (new XMLSerializer()).serializeToString(doc)
}

function buildElement (element: SimpleXml.Element, doc: Document): HTMLElement {
  const node: HTMLElement = doc.createElement(element.name)
  if (isNotUndefined(element.attributes)) {
    setAttributes(node, element.attributes)
  }
  if (isNotUndefined(element.children)) {
    setChildren(node, element.children)
  }
  return node
}

function setAttributes (node: HTMLElement, attributes: SimpleXml.ElementAttributes): void {
  for (const [name, value] of Object.entries(attributes)) {
    if (isNotUndefined(value)) {
      node.setAttribute(name, `${value}`)
    }
  }
}

function setChildren (node: HTMLElement, children: SimpleXml.ElementChildren): void {
  const t = typeof children
  if (t === 'string' || t === 'number') {
    node.textContent = `${children as SimpleXml.Text}`
    return
  }

  for (const c of (children as Iterable<SimpleXml.Comment | SimpleXml.Element>)) {
    if (c.type === 'element') {
      node.appendChild(buildElement(c, node.ownerDocument))
    }
    // comments are not implemented, yet
  }
}
