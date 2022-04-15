import { isPositiveInteger, PositiveInteger } from '../types'
import { Attachment } from './attachment'

export class SWID {
  tagId: string
  name: string
  version: string | null = null
  patch: boolean | null = null
  text: Attachment | null = null
  url: URL | null = null

  constructor (tagId: string, name: string) {
    this.tagId = tagId
    this.name = name
  }

  #tagVersion: PositiveInteger | null = null
  get tagVersion (): PositiveInteger | null {
    return this.#tagVersion
  }

  /**
   * @throws {TypeError} if value is not PositiveInteger nor null
   */
  set tagVersion (value: PositiveInteger | null) {
    if (value !== null && !isPositiveInteger(value)) {
      throw new TypeError('Not PositiveInteger nor null')
    }
    this.#tagVersion = value
  }
}
