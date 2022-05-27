import { PackageURL } from 'packageurl-js'
import { BomRef, BomRefRepository } from './Models.BomRef'
import { ComponentType } from './Enums.ComponentType'
import { ExternalReferenceRepository } from './Models.ExternalReference'
import { HashRepository } from './Models.Hash'
import { LicenseRepository } from './Models.License'
import { ComponentScope } from './Enums.ComponentScope'
import { CPE, isCPE } from './Types.CPE'
import { OrganizationalEntity } from './Models.OrganizationalEntity'
import { SWID } from './Models.SWID'

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

  #cpe: CPE | null = null
  get cpe (): CPE | null {
    return this.#cpe
  }

  /**
   * @throws {TypeError} if value is neither CPE nor null
   */
  set cpe (value: CPE | null) {
    if (value !== null && !isCPE(value)) {
      throw new TypeError('Not CPE nor null')
    }
    this.#cpe = value
  }

  #dependencies = new BomRefRepository()
  get dependencies (): BomRefRepository {
    return this.#dependencies
  }

  set dependencies (value: BomRefRepository) {
    this.#dependencies = value
  }

  compare (other: Component): number {
    const bomRefCompare = this.bomRef.compare(other.bomRef)
    if (bomRefCompare !== 0) {
      return bomRefCompare
    }
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
