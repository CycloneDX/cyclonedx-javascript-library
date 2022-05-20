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
   * Must be alphanumeric.
   * Must start with alpha.
   * Must not contain whitespace characters.
   */
  type attributeName = string

  /**
   * Must be alphanumeric.
   * Must start with alpha.
   * Must not contain whitespace characters.
   */
  type elementName = string

  export type Text = string | number

  export type Unset = undefined | null

  export interface Element {
    type: 'element'
    name: elementName
    attributes?: { [key: attributeName]: Text | Unset }
    children?: Iterable<Comment | Element> | Text | Unset
  }

  export interface Comment {
    type: 'comment'
    text?: Text | Unset
  }

}
