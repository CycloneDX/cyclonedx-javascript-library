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

import type { PackageURL } from 'packageurl-js'

import type { Comparable } from '../_helpers/sortable'
import { SortableComparables } from '../_helpers/sortable'
import { treeIteratorSymbol } from '../_helpers/tree'
import type { ComponentScope, ComponentType } from '../enums'
import type { CPE } from '../types/cpe'
import { isCPE } from '../types/cpe'
import { BomRef, BomRefRepository } from './bomRef'
import type { Copyright } from './copyright'
import { CopyrightRepository} from './copyright'
import { ExternalReferenceRepository } from './externalReference'
import { HashDictionary } from './hash'
import { LicenseRepository } from './license'
import type { OrganizationalEntity } from './organizationalEntity'
import { PropertyRepository } from './property'
import type { SWID } from './swid'

export interface OptionalComponentProperties {
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
  components?: Component['components']
  cpe?: Component['cpe']
  properties?: Component['properties']
  evidence?: Component['evidence']

  dependencies?: Component['dependencies']
}

export class Component implements Comparable<Component> {
  type: ComponentType
  name: string
  author?: string
  copyright?: Copyright
  description?: string
  externalReferences: ExternalReferenceRepository
  group?: string
  hashes: HashDictionary
  licenses: LicenseRepository
  publisher?: string
  purl?: PackageURL
  scope?: ComponentScope
  supplier?: OrganizationalEntity
  swid?: SWID
  version?: string
  components: ComponentRepository
  properties: PropertyRepository
  evidence?: ComponentEvidence

  /** @see {@link bomRef} */
  readonly #bomRef: BomRef

  /** @see {@link cpe} */
  #cpe?: CPE

  dependencies: BomRefRepository

  /**
   * @throws {@link TypeError} if `op.cpe` is neither {@link CPE} nor `undefined`
   */
  constructor (type: Component['type'], name: Component['name'], op: OptionalComponentProperties = {}) {
    this.#bomRef = new BomRef(op.bomRef)
    this.type = type
    this.name = name
    this.supplier = op.supplier
    this.author = op.author
    this.copyright = op.copyright
    this.externalReferences = op.externalReferences ?? new ExternalReferenceRepository()
    this.group = op.group
    this.hashes = op.hashes ?? new HashDictionary()
    this.licenses = op.licenses ?? new LicenseRepository()
    this.publisher = op.publisher
    this.purl = op.purl
    this.scope = op.scope
    this.swid = op.swid
    this.version = op.version
    this.description = op.description
    this.components = op.components ?? new ComponentRepository()
    this.cpe = op.cpe
    this.properties = op.properties ?? new PropertyRepository()
    this.evidence = op.evidence

    this.dependencies = op.dependencies ?? new BomRefRepository()
  }

  get bomRef (): BomRef {
    return this.#bomRef
  }

  get cpe (): CPE | undefined {
    return this.#cpe
  }

  /**
   * @throws {@link TypeError} if value is neither {@link CPE} nor `undefined`
   */
  set cpe (value: CPE | undefined) {
    if (value !== undefined && !isCPE(value)) {
      throw new TypeError('Not CPE nor undefined')
    }
    this.#cpe = value
  }

  compare (other: Component): number {
    // The purpose of this method is not to test for equality, but have deterministic comparability.
    const bomRefCompare = this.bomRef.compare(other.bomRef)
    if (bomRefCompare !== 0) {
      return bomRefCompare
    }
    if (this.purl !== undefined && other.purl !== undefined) {
      return this.purl.toString().localeCompare(other.purl.toString())
    }
    if (this.#cpe !== undefined && other.#cpe !== undefined) {
      return this.#cpe.localeCompare(other.#cpe)
    }
    /* eslint-disable @typescript-eslint/strict-boolean-expressions -- run compares in weighted order */
    return (this.group ?? '').localeCompare(other.group ?? '') ||
      this.name.localeCompare(other.name) ||
      (this.version ?? '').localeCompare(other.version ?? '')
    /* eslint-enable  @typescript-eslint/strict-boolean-expressions */
  }
}

export class ComponentRepository extends SortableComparables<Component> {
  * [treeIteratorSymbol] (): Generator<Component> {
    for (const component of this) {
      yield component
      yield * component.components[treeIteratorSymbol]()
    }
  }
}

export interface OptionalComponentEvidenceProperties {
  licenses?: ComponentEvidence['licenses']
  copyright?: ComponentEvidence['copyright']
}

export class ComponentEvidence {
  licenses: LicenseRepository
  copyright: CopyrightRepository

  constructor (op: OptionalComponentEvidenceProperties = {}) {
    this.licenses = op.licenses ?? new LicenseRepository()
    this.copyright = op.copyright ?? new CopyrightRepository()
  }
}
