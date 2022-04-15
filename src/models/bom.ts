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

    set version (value: PositiveInteger) {
      if (!isPositiveInteger(value)) {
        throw new RangeError('Not PositiveInteger')
      }
      this.#version = value
    }

    #serialNumber: UrnUuid | null = null
    get serialNumber (): UrnUuid | null {
      return this.#serialNumber
    }

    set serialNumber (value: UrnUuid | null) {
      if (value !== null && !isUrnUuid(value)) {
        throw new RangeError('Not UrnUuid')
      }
      this.#serialNumber = value
    }
}
