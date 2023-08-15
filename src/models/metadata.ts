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

import type { Component } from './component'
import { LifecycleRepository } from './lifecycle'
import { OrganizationalContactRepository } from './organizationalContact'
import type { OrganizationalEntity } from './organizationalEntity'
import { ToolRepository } from './tool'

export interface OptionalMetadataProperties {
  timestamp?: Metadata['timestamp']
  lifecycles?: Metadata['lifecycles']
  tools?: Metadata['tools']
  authors?: Metadata['authors']
  component?: Metadata['component']
  manufacture?: Metadata['manufacture']
  supplier?: Metadata['supplier']
}

export class Metadata {
  timestamp?: Date
  lifecycles: LifecycleRepository
  tools: ToolRepository
  authors: OrganizationalContactRepository
  component?: Component
  manufacture?: OrganizationalEntity
  supplier?: OrganizationalEntity

  constructor (op: OptionalMetadataProperties = {}) {
    this.timestamp = op.timestamp
    this.lifecycles = op.lifecycles ?? new LifecycleRepository()
    this.tools = op.tools ?? new ToolRepository()
    this.authors = op.authors ?? new OrganizationalContactRepository()
    this.component = op.component
    this.manufacture = op.manufacture
    this.supplier = op.supplier
  }
}
