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
Copyright (c) Steve Springett. All Rights Reserved.
*/

interface OptionalProperties {
  name?: OrganizationalContact['name']
  email?: OrganizationalContact['email']
  phone?: OrganizationalContact['phone']
}

export class OrganizationalContact {
  name?: string
  email?: string
  phone?: string

  constructor (op: OptionalProperties = {}) {
    this.name = op.name
    this.email = op.email
    this.phone = op.phone
  }

  compare (other: OrganizationalContact): number {
    /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- run compares in weighted order */
    return (this.name ?? '').localeCompare(other.name ?? '') ||
      (this.email ?? '').localeCompare(other.email ?? '') ||
      (this.phone ?? '').localeCompare(other.phone ?? '')
  }
}

export class OrganizationalContactRepository extends Set<OrganizationalContact> {
  static compareItems (a: OrganizationalContact, b: OrganizationalContact): number {
    return a.compare(b)
  }
}
