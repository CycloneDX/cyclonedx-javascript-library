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

import { HashRepository } from './hash'
import { ExternalReferenceRepository } from './externalReference'
import { Comparable, SortableSet } from '../helpers/sortableSet'

interface OptionalProperties {
  vendor?: Tool['vendor']
  name?: Tool['name']
  version?: Tool['version']
  hashes?: Tool['hashes']
  externalReferences?: Tool['externalReferences']
}

export class Tool implements Comparable {
  vendor?: string
  name?: string
  version?: string
  hashes: HashRepository
  externalReferences: ExternalReferenceRepository

  constructor (op: OptionalProperties = {}) {
    this.vendor = op.vendor
    this.name = op.name
    this.version = op.version
    this.hashes = op.hashes ?? new HashRepository()
    this.externalReferences = op.externalReferences ?? new ExternalReferenceRepository()
  }

  compare (other: Tool): number {
    // The purpose of this method is not to test for equality, but have deterministic comparability.
    /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- run compares in weighted order */
    return (this.vendor ?? '').localeCompare(other.vendor ?? '') ||
      (this.name ?? '').localeCompare(other.name ?? '') ||
      (this.version ?? '').localeCompare(other.version ?? '')
  }
}

export class ToolRepository extends SortableSet<Tool> {
}
