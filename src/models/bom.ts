import { isPositiveInteger, isUrnUuid, PositiveInteger, UrnUuid } from '../types'
import { Metadata } from './metadata'
import { ComponentRepository } from './component'

interface OptionalProperties {
  metadata?: Bom['metadata']
  components?: Bom['components']
  version?: Bom['version']
  serialNumber?: Bom['serialNumber']
}

export class Bom {
  metadata: Metadata
  components: ComponentRepository

  /** @see version */
  #version: PositiveInteger = 1

  /** @see serialNumber */
  #serialNumber?: UrnUuid

  // Property `bomFormat` is not part of model, it is runtime information.
  // Property `specVersion` is not part of model, it is runtime information.

  // Property `dependencies` is not part of this model, but part of `Component` and other models.
  // The dependency graph can be normalized on render-time, no need to store it in the bom model.

  constructor (op: OptionalProperties = {}) {
    this.metadata = op.metadata ?? new Metadata()
    this.components = op.components ?? new ComponentRepository()
    this.version = op.version ?? this.version
    this.serialNumber = op.serialNumber
  }

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

  get serialNumber (): UrnUuid | undefined {
    return this.#serialNumber
  }

  /**
   * @throws {TypeError} if value is neither UrnUuid nor undefined
   */
  set serialNumber (value: UrnUuid | undefined) {
    if (value !== undefined && !isUrnUuid(value)) {
      throw new TypeError('Not UrnUuid nor undefined')
    }
    this.#serialNumber = value
  }
}
