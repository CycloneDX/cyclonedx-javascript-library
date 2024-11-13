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

import type { Comparable } from '../_helpers/sortable'
import { SortableComparables } from '../_helpers/sortable'
import type { Component } from "./component";
import { ComponentRepository} from "./component";
import { ExternalReferenceRepository } from './externalReference'
import { HashDictionary } from './hash'
import type { Service } from "./service";
import { ServiceRepository } from "./service";

export interface OptionalToolProperties {
  vendor?: Tool['vendor']
  name?: Tool['name']
  version?: Tool['version']
  hashes?: Tool['hashes']
  externalReferences?: Tool['externalReferences']
}

export class Tool implements Comparable<Tool> {
  vendor?: string
  name?: string
  version?: string
  hashes: HashDictionary
  externalReferences: ExternalReferenceRepository

  constructor (op: OptionalToolProperties = {}) {
    this.vendor = op.vendor
    this.name = op.name
    this.version = op.version
    this.hashes = op.hashes ?? new HashDictionary()
    this.externalReferences = op.externalReferences ?? new ExternalReferenceRepository()
  }

  compare (other: Tool): number {
    // The purpose of this method is not to test for equality, but have deterministic comparability.
    /* eslint-disable @typescript-eslint/strict-boolean-expressions -- run compares in weighted order */
    return (this.vendor ?? '').localeCompare(other.vendor ?? '') ||
      (this.name ?? '').localeCompare(other.name ?? '') ||
      (this.version ?? '').localeCompare(other.version ?? '')
    /* eslint-enable @typescript-eslint/strict-boolean-expressions */
  }

  static fromComponent(component: Component): Tool {
    return new Tool({
      vendor: component.group,
      name: component.name,
      version: component.version,
      hashes: component.hashes,
      externalReferences: component.externalReferences
    })
  }

  static fromService(service: Service): Tool {
    return new Tool({
      vendor: service.group,
      name: service.name,
      version: service.version,
      externalReferences: service.externalReferences
    })
  }
}

export class ToolRepository extends SortableComparables<Tool> {
}


export interface OptionalToolsProperties {
  components?: Tools['components']
  services?: Tools['services']
  tools?: Tools['tools']
}

export class Tools {
  components: ComponentRepository
  services: ServiceRepository
  tools: ToolRepository

  constructor(op: OptionalToolsProperties = {}) {
    this.components = op.components ?? new ComponentRepository()
    this.services = op.services ?? new ServiceRepository()
    this.tools = op.tools ?? new ToolRepository()
  }

  get size(): number {
    return this.components.size
      + this.services.size
      + this.tools.size
  }
}
