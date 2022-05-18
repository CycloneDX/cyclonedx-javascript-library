// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SimpleXml {

  export interface Element {
    type: 'element'
    name: string
    attributes?: { [key: string]: string | number | undefined | null }
    children?: Iterable<Comment | Element> | string | undefined | null
  }

  export interface Comment {
    type: 'comment'
    text?: string | undefined | null
  }

}
