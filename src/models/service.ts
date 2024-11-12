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

import type { Comparable } from "../_helpers/sortable";
import { SortableComparables } from "../_helpers/sortable";
import { treeIteratorSymbol } from "../_helpers/tree";
import { BomRef, BomRefRepository } from "./bomRef";
import { ExternalReferenceRepository } from "./externalReference";
import { LicenseRepository } from "./license";
import type {OrganizationalEntity } from "./organizationalEntity";
import { PropertyRepository } from "./property";

export interface OptionalServiceProperties {
  bomRef?: BomRef['value']
  provider?: Service['provider']
  group?: Service['group']
  version?: Service['version']
  description?: Service['description']
  licenses?: Service['licenses']
  externalReferences?: Service['externalReferences']
  services?: Service['services']
  properties?: Service['properties']

  dependencies?: Service['dependencies']
}

export class Service implements Comparable<Service> {
  provider?: OrganizationalEntity
  group?: string
  name: string
  version?: string
  description?: string
  licenses: LicenseRepository
  externalReferences: ExternalReferenceRepository
  services: ServiceRepository
  properties: PropertyRepository

  /** @see {@link bomRef} */
  readonly #bomRef: BomRef

  dependencies: BomRefRepository

  constructor(name: Service['name'], op: OptionalServiceProperties = {}) {
    this.#bomRef = new BomRef(op.bomRef)
    this.provider = op.provider
    this.group = op.group
    this.name = name
    this.version = op.version
    this.description = op.description
    this.licenses = op.licenses ?? new LicenseRepository()
    this.externalReferences = op.externalReferences ?? new ExternalReferenceRepository()
    this.services = op.services ?? new ServiceRepository()
    this.properties = op.properties ?? new PropertyRepository()

    this.dependencies = op.dependencies ?? new BomRefRepository()
  }

  get bomRef(): BomRef {
    return this.#bomRef
  }

  compare(other: Service): number {
    // The purpose of this method is not to test for equality, but have deterministic comparability.
    const bomRefCompare = this.bomRef.compare(other.bomRef)
    if (bomRefCompare !== 0) {
      return bomRefCompare
    }
    /* eslint-disable @typescript-eslint/strict-boolean-expressions -- run compares in weighted order */
    return (this.group ?? '').localeCompare(other.group ?? '') ||
      this.name.localeCompare(other.name) ||
      (this.version ?? '').localeCompare(other.version ?? '')
    /* eslint-enable  @typescript-eslint/strict-boolean-expressions */
  }

}

export class ServiceRepository extends SortableComparables<Service> {
  * [treeIteratorSymbol] (): Generator<Service> {
    for (const service of this) {
      yield service
      yield * service.services[treeIteratorSymbol]()
    }
  }
}
