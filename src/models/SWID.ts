import { isNonNegativeInteger, NonNegativeInteger } from '../types'
import { Attachment } from './attachment'

/**
 * @see {@link https://csrc.nist.gov/projects/Software-Identification-SWID}
 */
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

  #tagVersion: NonNegativeInteger | null = null
  get tagVersion (): NonNegativeInteger | null {
    return this.#tagVersion
  }

  /**
   * @throws {TypeError} if value is neither NonNegativeInteger nor null
   */
  set tagVersion (value: NonNegativeInteger | null) {
    if (value !== null && !isNonNegativeInteger(value)) {
      throw new TypeError('Not NonNegativeInteger nor null')
    }
    this.#tagVersion = value
  }
}
