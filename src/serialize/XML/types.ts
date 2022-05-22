// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace XmlSchema {
  export type AnyURI = string
  /**
   * Test whether format is XML::anyURI - best-effort.
   *
   * @see {@link http://www.w3.org/TR/xmlschema-2/#anyURI}
   * @see {@link http://www.datypic.com/sc/xsd/t-xsd_anyURI.html}
   */
  export function isAnyURI (value: AnyURI | any): value is AnyURI {
    return typeof value === 'string' &&
      value.length > 0 &&
      Array.from(value).filter(c => c === '#').length <= 1
    // TODO add more validation according to spec
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SimpleXml {

  /**
   * Attribute's name.
   *
   * Must be alphanumeric.
   * Must start with alpha.
   * Must not contain whitespace characters.
   */
  export type AttributeName = string

  /**
   * Element's name.
   *
   * Must be alphanumeric.
   * Must start with alpha.
   * Must not contain whitespace characters.
   */
  export type ElementName = string

  /**
   * Textual representation.
   *
   * Be aware that low-/high-bytes could be represented as numbers.
   * They might need to be converted on serialization.
   */
  export type Text = string | number

  /**
   * Unset representation.
   *
   * Do NOT allow null here, as it is context-aware sometimes an empty string or unset
   * in a space where context is unknown.
   */
  export type Unset = undefined

  export interface ElementAttributes {
    [key: AttributeName]: Text | Unset
  }

  export type ElementChildren = Iterable<Comment | Element> | Text | Unset

  /**
   * Element node.
   */
  export interface Element {
    type: 'element'
    name: ElementName
    attributes?: ElementAttributes
    children?: ElementChildren
  }

  /**
   * Element node with textual content
   */
  export interface TextElement extends Element {
    children: Text
  }

  /**
   * Comment node.
   */
  export interface Comment {
    type: 'comment'
    text?: Text
  }

}
