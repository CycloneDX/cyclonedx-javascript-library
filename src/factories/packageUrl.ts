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

import { Component } from '../models'
import { PackageURL } from 'packageurl-js'
import { ExternalReferenceType } from '../enums'

export class PackageUrlFactory {
  readonly #type: string

  constructor (type: PackageURL['type']) {
    this.#type = type
  }

  makeFromComponent (component: Component): PackageURL | undefined {
    const qualifiers: { [key: string]: string } = {}
    let subpath: string | undefined

    for (const e of component.externalReferences) {
      if (e.type === ExternalReferenceType.VCS) {
        [qualifiers.vcs_url, subpath] = e.url.toString().split('#', 2)
        break
      }
    }

    try {
      return new PackageURL(
        this.#type,
        component.group,
        component.name,
        component.version,
        qualifiers,
        subpath
      )
    } catch {
      return undefined
    }
  }
}
