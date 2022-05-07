import { isPositiveInteger, isUrnUuid, PositiveInteger, UrnUuid } from '../types'
import { Metadata } from './metadata'
import { ComponentRepository } from './component'

export class Bom {
  // property `bomFormat` is not part of model, it is a runtime information
  // property `specVersion` is not part of model, it is a runtime information

  metadata = new Metadata()
  components = new ComponentRepository()

  #version: PositiveInteger = 1
  get version (): PositiveInteger {
    return this.#version
  }

  /**
   * @throws {TypeError} if value is not positive integer
   */
  set version (value: PositiveInteger) {
    if (!isPositiveInteger(value)) {
      throw new TypeError('Not PositiveInteger')
    }
    this.#version = value
  }

  #serialNumber: UrnUuid | null = null
  get serialNumber (): UrnUuid | null {
    return this.#serialNumber
  }

  /**
   * @throws {TypeError} if value is not UrnUuid nor null
   */
  set serialNumber (value: UrnUuid | null) {
    if (value !== null && !isUrnUuid(value)) {
      throw new TypeError('Not UrnUuid nor null')
    }
    this.#serialNumber = value
  }
}
