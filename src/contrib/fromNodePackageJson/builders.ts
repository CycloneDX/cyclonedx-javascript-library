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

import { chainI } from '../../_helpers/iterable'
import { isObject } from '../../_helpers/plainObject'
import { ComponentType } from '../../enums/componentType'
import { Component } from '../../models/component'
import { ExternalReferenceRepository } from '../../models/externalReference'
import type { License } from '../../models/license'
import { LicenseRepository } from '../../models/license'
import { Property, PropertyRepository } from '../../models/property'
import { Tool } from '../../models/tool'
import type { LicenseFactory } from '../license/factories'
import { splitNameGroup } from './_helpers/packageJson'
import type { ExternalReferenceFactory } from './factories'
import type { NodePackageJson } from './types'

/**
 * Node-specific ToolBuilder.
 */
export class ToolBuilder {
  readonly #extRefFactory: ExternalReferenceFactory

  constructor (extRefFactory: ToolBuilder['extRefFactory']) {
    this.#extRefFactory = extRefFactory
  }

  get extRefFactory (): ExternalReferenceFactory {
    return this.#extRefFactory
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
      externalReferences: new ExternalReferenceRepository(this.#extRefFactory.makeExternalReferences(data))
    })
  }
}

/**
 * Node-specific ComponentBuilder.
 */
export class ComponentBuilder {
  readonly #extRefFactory: ExternalReferenceFactory
  readonly #licenseFactory: LicenseFactory

  constructor (
    extRefFactory: ComponentBuilder['extRefFactory'],
    licenseFactory: ComponentBuilder['licenseFactory']
  ) {
    this.#extRefFactory = extRefFactory
    this.#licenseFactory = licenseFactory
  }

  get extRefFactory (): ExternalReferenceFactory {
    return this.#extRefFactory
  }

  get licenseFactory (): LicenseFactory {
    return this.#licenseFactory
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

    const externalReferences = new ExternalReferenceRepository(
      this.#extRefFactory.makeExternalReferences(data)
    )

    const licenses = new LicenseRepository(chainI(
      (
        /* see https://docs.npmjs.com/cli/v9/configuring-npm/package-json#license */
      typeof data.license === 'string'
        ? [this.#licenseFactory.makeFromString(data.license)]
        : []
      ),
      this.#makeLicenses(data.licenses)
    ))

    const properties = new PropertyRepository(
      this.#makeEngineProperties(data.engines)
    )

    return new Component(type, name, {
      author,
      description,
      externalReferences,
      group,
      licenses,
      properties,
      version
    })
  }

  * #makeLicenses (licenses: NodePackageJson['licenses']): Generator<License> {
    if (!Array.isArray(licenses)) return;
    /* see https://github.com/SchemaStore/schemastore/blob/master/src/schemas/json/package.json */
    for (const licenseData of licenses) {
      if (!isObject(licenses)) continue;
      const { type, url } = licenseData
      if (typeof type !== 'string') continue;
      const license = this.#licenseFactory.makeDisjunctive(type)
      license.url = typeof url === 'string'
        ? url
        : undefined
      yield license
    }
  }

  * #makeEngineProperties (engines: NodePackageJson['engines']): Generator<Property> {
    if (!isObject(engines)) return;
    for (const [engine, constraint] of Object.entries(engines)) {
      if (typeof constraint !== 'string') continue;
      yield new Property(
        `cdx:npm:package:constraint:engine:${engine}`,
        constraint)
    }
  }

}
