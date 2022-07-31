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

import * as Enums from '../enums'
import * as Models from '../models'
import * as Factories from '../factories/index.node'
import { PackageJson, splitNameGroup } from '../helpers/packageJson'

/**
 * @see {@link https://docs.npmjs.com/cli/v8/configuring-npm/package-json PackageJson spec}
 */

export class ToolBuilder {
  readonly #extRefFactory: Factories.FromPackageJson.ExternalReferenceFactory

  constructor (extRefFactory: Factories.FromPackageJson.ExternalReferenceFactory) {
    this.#extRefFactory = extRefFactory
  }

  get extRefFactory (): Factories.FromPackageJson.ExternalReferenceFactory {
    return this.#extRefFactory
  }

  makeTool (data: PackageJson): Models.Tool | undefined {
    const [name, vendor] = typeof data.name === 'string'
      ? splitNameGroup(data.name)
      : []

    return new Models.Tool({
      vendor,
      name,
      version: (typeof data.version === 'string')
        ? data.version
        : undefined,
      externalReferences: new Models.ExternalReferenceRepository(this.#extRefFactory.makeExternalReferences(data))
    })
  }
}

export class ComponentBuilder {
  readonly #extRefFactory: Factories.FromPackageJson.ExternalReferenceFactory
  readonly #licenseFactory: Factories.LicenseFactory

  constructor (
    extRefFactory: Factories.FromPackageJson.ExternalReferenceFactory,
    licenseFactory: Factories.LicenseFactory
  ) {
    this.#extRefFactory = extRefFactory
    this.#licenseFactory = licenseFactory
  }

  get extRefFactory (): Factories.FromPackageJson.ExternalReferenceFactory {
    return this.#extRefFactory
  }

  get licenseFactory (): Factories.LicenseFactory {
    return this.#licenseFactory
  }

  makeComponent (data: PackageJson, type: Enums.ComponentType = Enums.ComponentType.Library): Models.Component | undefined {
    if (typeof data.name !== 'string') {
      return undefined
    }

    const [name, group] = splitNameGroup(data.name)
    if (name.length <= 0) {
      return undefined
    }

    /** @see {@link https://docs.npmjs.com/cli/v8/configuring-npm/package-json#author} */
    const author = typeof data.author === 'string'
      ? data.author
      : (typeof data.author?.name === 'string'
          ? data.author.name
          : undefined)
    /** @see {@link https://docs.npmjs.com/cli/v8/configuring-npm/package-json#description-1} */
    const description = typeof data.description === 'string'
      ? data.description
      : undefined
    /** @see {@link https://docs.npmjs.com/cli/v8/configuring-npm/package-json#version} */
    const version = typeof data.version === 'string'
      ? data.version
      : undefined
    const externalReferences = this.#extRefFactory.makeExternalReferences(data)
    /** @see {@link https://docs.npmjs.com/cli/v8/configuring-npm/package-json#license} */
    const license = typeof data.license === 'string'
      ? this.#licenseFactory.makeFromString(data.license)
      : undefined

    return new Models.Component(type, name, {
      author,
      description,
      externalReferences: new Models.ExternalReferenceRepository(externalReferences),
      group,
      licenses: new Models.LicenseRepository(
        license === undefined
          ? []
          : [license]
      ),
      version
    })
  }
}
