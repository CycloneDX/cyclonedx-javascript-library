/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

import { PackageURL } from 'packageurl-js'

import { CPE, isCPE } from '../types'
import { ComponentScope, ComponentType } from '../enums'
import { BomRef, BomRefRepository } from './bomRef'
import { HashRepository } from './hash'
import { OrganizationalEntity } from './organizationalEntity'
import { ExternalReferenceRepository } from './externalReference'
import { LicenseRepository } from './license'
import { SWID } from './swid'
import { Comparable, SortableSet } from '../helpers/sortableSet'

interface OptionalProperties {
  bomRef?: BomRef['value']
  author?: Component['author']
  copyright?: Component['copyright']
  description?: Component['description']
  externalReferences?: Component['externalReferences']
  group?: Component['group']
  hashes?: Component['hashes']
  licenses?: Component['licenses']
  publisher?: Component['publisher']
  purl?: Component['purl']
  scope?: Component['scope']
  supplier?: Component['supplier']
  swid?: Component['swid']
  version?: Component['version']
  dependencies?: Component['dependencies']
  cpe?: Component['cpe']
}

export class Component implements Comparable {
  type: ComponentType
  name: string
  author?: string
  copyright?: string
  description?: string
  externalReferences: ExternalReferenceRepository
  group?: string
  hashes: HashRepository
  licenses: LicenseRepository
  publisher?: string
  purl?: PackageURL
  scope?: ComponentScope
  supplier?: OrganizationalEntity
  swid?: SWID
  version?: string
  dependencies: BomRefRepository

  /** @see bomRef */
  readonly #bomRef: BomRef

  /** @see cpe */
  #cpe?: CPE

  /**
   * @throws {TypeError} if {@see op.cpe} is neither {@see CPE} nor {@see undefined}
   */
  constructor (type: ComponentType, name: string, op: OptionalProperties = {}) {
    this.#bomRef = new BomRef(op.bomRef)
    this.type = type
    this.name = name
    this.supplier = op.supplier
    this.author = op.author
    this.copyright = op.copyright
    this.externalReferences = op.externalReferences ?? new ExternalReferenceRepository()
    this.group = op.group
    this.hashes = op.hashes ?? new HashRepository()
    this.licenses = op.licenses ?? new LicenseRepository()
    this.publisher = op.publisher
    this.purl = op.purl
    this.scope = op.scope
    this.swid = op.swid
    this.version = op.version
    this.description = op.description
    this.dependencies = op.dependencies ?? new BomRefRepository()
    this.cpe = op.cpe
  }

  get bomRef (): BomRef {
    return this.#bomRef
  }

  get cpe (): CPE | undefined {
    return this.#cpe
  }

  /**
   * @throws {TypeError} if value is neither {@see CPE} nor {@see undefined}
   */
  set cpe (value: CPE | undefined) {
    if (value !== undefined && !isCPE(value)) {
      throw new TypeError('Not CPE nor undefined')
    }
    this.#cpe = value
  }

  compare (other: Component): number {
    const bomRefCompare = this.bomRef.compare(other.bomRef)
    if (bomRefCompare !== 0) {
      return bomRefCompare
    }
    if (this.purl !== undefined && other.purl !== undefined) {
      return this.purl.toString().localeCompare(other.purl.toString())
    }
    if (this.#cpe !== undefined && other.#cpe !== undefined) {
      return this.#cpe.toString().localeCompare(other.#cpe.toString())
    }
    /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- run compares in weighted order */
    return (this.group ?? '').localeCompare(other.group ?? '') ||
      this.name.localeCompare(other.name) ||
      (this.version ?? '').localeCompare(other.version ?? '')
  }
}

export class ComponentRepository extends SortableSet<Component> {
}
