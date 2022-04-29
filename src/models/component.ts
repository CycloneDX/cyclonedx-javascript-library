import { PackageURL } from 'packageurl-js'

import { CPE, isCPE } from '../types'
import { ComponentScope, ComponentType } from '../enums'
import { BomRef } from './bomRef'
import { HashRepository } from './hash'
import { OrganizationalEntity } from './organizationalEntity'
import { ExternalReferenceRepository } from './externalReference'
import { LicenseRepository } from './license'
import { SWID } from './SWID'

export class Component {
  readonly bomRef = new BomRef()
  type: ComponentType
  name: string
  author: string | null = null
  copyright: string | null = null
  description: string | null = null
  externalReferences = new ExternalReferenceRepository()
  group: string | null = null
  hashes = new HashRepository()
  licenses = new LicenseRepository()
  publisher: string | null = null
  purl: PackageURL | null = null
  scope: ComponentScope | null = null
  supplier: OrganizationalEntity | null = null
  swid: SWID | null = null
  version: string | null = null

  constructor (type: ComponentType, name: string) {
    this.type = type
    this.name = name
  }

  // see https://nvd.nist.gov/products/cpe
  #cpe: CPE | null = null
  get cpe (): CPE | null {
    return this.#cpe
  }

  /**
   * @throws {TypeError} if value is not CPE nor null
   */
  set cpe (value: CPE | null) {
    if (value !== null && !isCPE(value)) {
      throw new TypeError('Not CPE nor null')
    }
    this.#cpe = value
  }

  compare (other: Component): number {
    const bomRefCompare = this.bomRef.compare(other.bomRef)
    if (bomRefCompare !== 0) { return bomRefCompare }
    if (this.purl !== null && other.purl !== null) {
      return this.purl.toString().localeCompare(other.purl.toString())
    }
    if (this.#cpe !== null && other.#cpe !== null) {
      return this.#cpe.toString().localeCompare(other.#cpe.toString())
    }
    /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- run compares in weighted order */
    return (this.group ?? '').localeCompare(other.group ?? '') ||
      this.name.localeCompare(other.name) ||
      (this.version ?? '').localeCompare(other.version ?? '')
  }
}

export class ComponentRepository extends Set<Component> {
  static compareItems (a: Component, b: Component): number {
    return a.compare(b)
  }
}
