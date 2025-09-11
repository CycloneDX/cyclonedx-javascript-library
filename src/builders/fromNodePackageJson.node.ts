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

/**
 * Node-specifics.
 *
 * Intended to run on normalized data structures
 * based on [PackageJson spec](https://github.com/SchemaStore/schemastore/blob/master/src/schemas/json/package.json)
 * and explained by [PackageJson description](https://docs.npmjs.com/cli/v9/configuring-npm/package-json).
 * Normalization should be done downstream, for example via [`normalize-package-data`](https://www.npmjs.com/package/normalize-package-data).
 */

import { splitNameGroup } from '../_helpers/packageJson'
import { ComponentType } from '../enums/componentType'
import type * as Factories from '../factories/index.node'
import { Component } from '../models/component'
import { ExternalReferenceRepository } from '../models/externalReference'
import { LicenseRepository } from '../models/license'
import { Tool } from '../models/tool'
import type { NodePackageJson } from '../types/nodePackageJson'

/**
 * Node-specific ToolBuilder.
 */
export class ToolBuilder {
  private readonly _extRefFactory: Factories.FromNodePackageJson.ExternalReferenceFactory

  constructor (extRefFactory: ToolBuilder['extRefFactory']) {
    this._extRefFactory = extRefFactory
  }

  get extRefFactory (): Factories.FromNodePackageJson.ExternalReferenceFactory {
    return this._extRefFactory
  }

  // Current implementation does not return `undefined` yet, but it is an option for future implementation.
  // To prevent future breaking changes, it is declared to return `undefined`.
  makeTool (data: NodePackageJson): Tool | undefined {
    const [name, vendor] = typeof data.name === 'string'
      ? splitNameGroup(data.name)
      : []

    return new Tool({
      vendor,
      name,
      version: (typeof data.version === 'string')
        ? data.version
        : undefined,
      externalReferences: new ExternalReferenceRepository(this._extRefFactory.makeExternalReferences(data))
    })
  }
}

/**
 * Node-specific ComponentBuilder.
 */
export class ComponentBuilder {
  private readonly _extRefFactory: Factories.FromNodePackageJson.ExternalReferenceFactory
  private readonly _licenseFactory: Factories.LicenseFactory

  constructor (
    extRefFactory: ComponentBuilder['extRefFactory'],
    licenseFactory: ComponentBuilder['licenseFactory']
  ) {
    this._extRefFactory = extRefFactory
    this._licenseFactory = licenseFactory
  }

  get extRefFactory (): Factories.FromNodePackageJson.ExternalReferenceFactory {
    return this._extRefFactory
  }

  get licenseFactory (): Factories.LicenseFactory {
    return this._licenseFactory
  }

  makeComponent (data: NodePackageJson, type: ComponentType = ComponentType.Library): Component | undefined {
    if (typeof data.name !== 'string') {
      return undefined
    }

    const [name, group] = splitNameGroup(data.name)
    if (name.length <= 0) {
      return undefined
    }

    /* see https://docs.npmjs.com/cli/v9/configuring-npm/package-json#author */
    const author = typeof data.author === 'string'
      ? data.author
      : (typeof data.author?.name === 'string'
          ? data.author.name
          : undefined)

    /* see https://docs.npmjs.com/cli/v9/configuring-npm/package-json#description-1 */
    const description = typeof data.description === 'string'
      ? data.description
      : undefined

    /* see https://docs.npmjs.com/cli/v9/configuring-npm/package-json#version */
    const version = typeof data.version === 'string'
      ? data.version
      : undefined

    const externalReferences = this._extRefFactory.makeExternalReferences(data)

    const licenses = new LicenseRepository()
    if (typeof data.license === 'string') {
      /* see https://docs.npmjs.com/cli/v9/configuring-npm/package-json#license */
      licenses.add(this._licenseFactory.makeFromString(data.license))
    }
    if (Array.isArray(data.licenses)) {
      /* see https://github.com/SchemaStore/schemastore/blob/master/src/schemas/json/package.json */
      for (const licenseData of data.licenses) {
        if (typeof licenseData.type === 'string') {
          const license = this._licenseFactory.makeDisjunctive(licenseData.type)
          license.url = typeof licenseData.url === 'string'
            ? licenseData.url
            : undefined
          licenses.add(license)
        }
      }
    }

    return new Component(type, name, {
      author,
      description,
      externalReferences: new ExternalReferenceRepository(externalReferences),
      group,
      licenses,
      version
    })
  }
}
