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

import { OrganizationalContactRepository } from './organizationalContact'

export interface OrganizationalEntityOptionalProperties {
  name?: OrganizationalEntity['name']
  url?: OrganizationalEntity['url']
  contact?: OrganizationalEntity['contact']
}

export class OrganizationalEntity {
  name?: string
  url: Set<URL | string>
  contact: OrganizationalContactRepository

  constructor (op: OrganizationalEntityOptionalProperties = {}) {
    this.name = op.name
    this.url = op.url ?? new Set()
    this.contact = op.contact ?? new OrganizationalContactRepository()
  }
}
