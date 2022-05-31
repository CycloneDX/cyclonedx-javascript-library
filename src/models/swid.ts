import { isNonNegativeInteger, NonNegativeInteger } from '../types'
import { Attachment } from './attachment'

interface OptionalProperties {
  version?: SWID['version']
  patch?: SWID['patch']
  text?: SWID['text']
  url?: SWID['url']
  tagVersion?: SWID['tagVersion']
}

/**
 * @see {@link https://csrc.nist.gov/projects/Software-Identification-SWID}
 */
export class SWID {
  tagId: string
  name: string
  version?: string
  patch?: boolean
  text?: Attachment
  url?: URL | string

  /** @see tagVersion */
  #tagVersion?: NonNegativeInteger

  /**
   * @throws {TypeError} if {@see op.tagVersion} is neither {@see NonNegativeInteger} nor {@see undefined}
   */
  constructor (tagId: string, name: string, op: OptionalProperties = {}) {
    this.tagId = tagId
    this.name = name
    this.version = op.version
    this.patch = op.patch
    this.text = op.text
    this.url = op.url
    this.tagVersion = op.tagVersion
  }

  get tagVersion (): NonNegativeInteger | undefined {
    return this.#tagVersion
  }

  /**
   * @throws {TypeError} if value is neither {@see NonNegativeInteger} nor {@see undefined}
   */
  set tagVersion (value: NonNegativeInteger | undefined) {
    if (value !== undefined && !isNonNegativeInteger(value)) {
      throw new TypeError('Not NonNegativeInteger nor undefined')
    }
    this.#tagVersion = value
  }
}
