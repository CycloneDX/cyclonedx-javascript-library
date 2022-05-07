import { isPositiveInteger, isUrnUuid, PositiveInteger, UrnUuid } from '../types'
import { Metadata } from './metadata'
import { ComponentRepository } from './component'

export class Bom {
  metadata = new Metadata()
  components = new ComponentRepository()

  // Property `bomFormat` is not part of model, it is a runtime information.
  // Property `specVersion` is not part of model, it is a runtime information.

  // Property `dependencies` is not part of this model, but part of `Component` and other models.
  // The dependency grapth can be normalized on rendertime, no need to store it in the bom model.

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
