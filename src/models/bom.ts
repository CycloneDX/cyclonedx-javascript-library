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

import type { PositiveInteger, UrnUuid } from '../types'
import { isPositiveInteger, isUrnUuid } from '../types'
import { ComponentRepository } from './component'
import { Metadata } from './metadata'
import { VulnerabilityRepository } from './vulnerability'

export interface OptionalBomProperties {
  metadata?: Bom['metadata']
  components?: Bom['components']
  version?: Bom['version']
  vulnerabilities?: Bom['vulnerabilities']
  serialNumber?: Bom['serialNumber']
}

export class Bom {
  metadata: Metadata
  components: ComponentRepository
  vulnerabilities: VulnerabilityRepository

  /** @see version */
  #version: PositiveInteger = 1

  /** @see serialNumber */
  #serialNumber?: UrnUuid

  // Property `bomFormat` is not part of model, it is runtime information.
  // Property `specVersion` is not part of model, it is runtime information.

  // Property `dependencies` is not part of this model, but part of `Component` and other models.
  // The dependency graph can be normalized on render-time, no need to store it in the bom model.

  /**
   * @throws {TypeError} if `op.version` is neither {@link PositiveInteger} nor `undefined`
   * @throws {TypeError} if `op.serialNumber` is neither {@link UrnUuid} nor `undefined`
   */
  constructor (op: OptionalBomProperties = {}) {
    this.metadata = op.metadata ?? new Metadata()
    this.components = op.components ?? new ComponentRepository()
    this.version = op.version ?? this.version
    this.vulnerabilities = op.vulnerabilities ?? new VulnerabilityRepository()
    this.serialNumber = op.serialNumber
  }

  get version (): PositiveInteger {
    return this.#version
  }

  /**
   * @throws {TypeError} if value is not {@link PositiveInteger}
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
   * @throws {TypeError} if value is neither {@link UrnUuid} nor `undefined`
   */
  set serialNumber (value: UrnUuid | undefined) {
    if (value !== undefined && !isUrnUuid(value)) {
      throw new TypeError('Not UrnUuid nor undefined')
    }
    this.#serialNumber = value
  }
}
