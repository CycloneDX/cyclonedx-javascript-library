import { Metadata } from './Models.Metadata'
import { ComponentRepository } from './Models.Component'
import { isPositiveInteger, PositiveInteger } from './Types.Integer'
import { isUrnUuid, UrnUuid } from './Types.URN'

export class Bom {
  metadata = new Metadata()
  components = new ComponentRepository()

  // Property `bomFormat` is not part of model, it is runtime information.
  // Property `specVersion` is not part of model, it is runtime information.

  // Property `dependencies` is not part of this model, but part of `Component` and other models.
  // The dependency graph can be normalized on render-time, no need to store it in the bom model.

  #version: PositiveInteger = 1
  get version (): PositiveInteger {
    return this.#version
  }

  /**
   * @throws {TypeError} if value is not PositiveInteger
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
   * @throws {TypeError} if value is neither UrnUuid nor null
   */
  set serialNumber (value: UrnUuid | null) {
    if (value !== null && !isUrnUuid(value)) {
      throw new TypeError('Not UrnUuid nor null')
    }
    this.#serialNumber = value
  }
}
