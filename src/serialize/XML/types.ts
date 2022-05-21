// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace XmlSchema {
  export type AnyURI = string
  export function isAnyURI (value: AnyURI | any): value is AnyURI {
    return typeof value === 'string'
    // @TODO add validator according to XML spec
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
  type attributeName = string

  /**
   * Element's name.
   *
   * Must be alphanumeric.
   * Must start with alpha.
   * Must not contain whitespace characters.
   */
  type elementName = string

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

  /**
   * Element node.
   */
  export interface Element {
    type: 'element'
    name: elementName
    attributes?: { [key: attributeName]: Text | Unset }
    children?: Iterable<Comment | Element> | Text | Unset
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
