import { BaseSerializer } from './BaseSerializer'
import { Factory as NormalizerFactory } from './XML/normalize'
import { Format, UnsupportedFormatError } from '../spec'
import { Bom } from '../models'
import { NormalizeOptions, SerializeOptions } from './types'
import { SimpleXml } from './XML/types'
import { isNotUndefined } from '../helpers/types'

/**
 * Base XML serializer.
 */
export abstract class BaseXmlSerializer extends BaseSerializer<SimpleXml.Element> {
  readonly #normalizerFactory: NormalizerFactory

  /**
   * @throws {UnsupportedFormatError} if spec does not support JSON format.
   */
  constructor (normalizerFactory: NormalizerFactory) {
    if (!normalizerFactory.spec.supportsFormat(Format.JSON)) {
      throw new UnsupportedFormatError('Spec does not support JSON format.')
    }

    super()
    this.#normalizerFactory = normalizerFactory
  }

  /**
   * @throws {Error}
   *
   * @private
   * @internal
   */
  protected _normalize (
    bom: Bom,
    { sortLists = false }: NormalizeOptions = {}
  ): SimpleXml.Element {
    return this.#normalizerFactory.makeForBom()
      .normalize(bom, { sortLists })
  }
}

const XmlSerializerForWebBrowserAvailable = typeof XMLSerializer === 'function' && typeof document === 'object'
export const XmlSerializer: undefined | typeof BaseXmlSerializer = (function (isBrowser: boolean) {
  /**
   * XML serializer for web browsers.
   */
  class XmlSerializerForWebBrowser extends BaseXmlSerializer {
    /**
     * @throws {Error}
     *
     * @private
     * @internal
     */
    protected _serialize (
      normalizedBom: SimpleXml.Element,
      options: SerializeOptions = {}
    ): string {
      const doc = document.implementation.createDocument(null, null)
      doc.appendChild(this.#buildElement(normalizedBom, doc))
      // TODO: incorporate `options.space`
      return (new XMLSerializer()).serializeToString(doc)
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

      for (const c of (children as Iterable<SimpleXml.Comment | SimpleXml.Element>)) {
        if (c.type === 'element') {
          node.appendChild(this.#buildElement(c, node.ownerDocument, parentNS))
        }
        // comments are not implemented, yet
      }
    }
  }

  return isBrowser
    ? XmlSerializerForWebBrowser
    : undefined
})(XmlSerializerForWebBrowserAvailable)
