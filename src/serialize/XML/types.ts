// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SimpleXml {

  export type Text = string | number

  export type Unset = undefined | null

  export interface Element {
    type: 'element'
    name: string
    attributes?: { [key: string]: Text | Unset }
    children?: Iterable<Comment | Element> | Text | Unset
  }

  export interface Comment {
    type: 'comment'
    text?: Text | Unset
  }

}
