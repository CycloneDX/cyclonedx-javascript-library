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

import * as fs from 'fs'
import * as path from 'path'

import { PackageJson, splitNameGroup } from '../_helpers/packageJson'
import * as Enums from '../enums'
import * as Factories from '../factories/index.node'
import * as Models from '../models'

/**
 * Node-specifics.
 *
 * @see {@link https://docs.npmjs.com/cli/v8/configuring-npm/package-json PackageJson spec}
 */

/**
 * Node-specific ToolBuilder.
 */
export class ToolBuilder {
  readonly #extRefFactory: Factories.FromNodePackageJson.ExternalReferenceFactory

  constructor (extRefFactory: ToolBuilder['extRefFactory']) {
    this.#extRefFactory = extRefFactory
  }

  get extRefFactory (): Factories.FromNodePackageJson.ExternalReferenceFactory {
    return this.#extRefFactory
  }

  // Current implementation does not return `undefined` yet, but it is an option for future implementation.
  // To prevent breaking changes, it is declared to return `undefined`.
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

/**
 * Node-specific ComponentBuilder.
 */
export class ComponentBuilder {
  readonly #extRefFactory: Factories.FromNodePackageJson.ExternalReferenceFactory
  readonly #licenseFactory: Factories.LicenseFactory
  readonly addLicenseText: boolean

  constructor (
    extRefFactory: ComponentBuilder['extRefFactory'],
    licenseFactory: ComponentBuilder['licenseFactory'],
    addLicenseText: boolean = false
  ) {
    this.#extRefFactory = extRefFactory
    this.#licenseFactory = licenseFactory
    this.addLicenseText = addLicenseText
  }

  get extRefFactory (): Factories.FromNodePackageJson.ExternalReferenceFactory {
    return this.#extRefFactory
  }

  get licenseFactory (): Factories.LicenseFactory {
    return this.#licenseFactory
  }

  searchLicenseFilename (pkgPath: string): string {
    const proposals = ['LICENSE', 'License', 'license.txt', 'LICENSE.md',
      'LICENSE-MIT.txt', 'LICENSE-MIT', 'mit.LICENSE',
      'LICENSE.BSD'
    ]
    for (const proposal of proposals) {
      const filenameProposal = path.join(pkgPath, proposal)
      if (fs.existsSync(filenameProposal)) {
        return filenameProposal
      }
    }
    return ''
  }

  createLicense (type: string, url: string | undefined, pkgPath: string | undefined): Models.DisjunctiveLicense {
    const license = this.#licenseFactory.makeDisjunctive(type)
    license.url = typeof url === 'string'
      ? url
      : undefined
    if (this.addLicenseText && pkgPath !== undefined) {
      const licFilename = this.searchLicenseFilename(pkgPath)
      if (licFilename.length > 0) {
        const licText = fs.readFileSync(licFilename, { encoding: 'base64' }).trim()
        license.text = new Models.Attachment(licText, { encoding: Enums.AttachmentEncoding.Base64 })
      }
    }
    return license
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

    const licenses = new Models.LicenseRepository()
    if (typeof data.license === 'string') {
      /** @see {@link https://docs.npmjs.com/cli/v8/configuring-npm/package-json#license} */
      licenses.add(this.createLicense(data.license, undefined, data.path))
    }
    if (Array.isArray(data.licenses)) {
      /** @see {@link https://github.com/SchemaStore/schemastore/blob/master/src/schemas/json/package.json} */
      for (const licenseData of data.licenses) {
        if (typeof licenseData?.type === 'string') {
          const url = typeof licenseData.url === 'string'
            ? licenseData.url
            : undefined
          licenses.add(this.createLicense(licenseData.type, url, data.path))
        }
      }
    }

    return new Models.Component(type, name, {
      author,
      description,
      externalReferences: new Models.ExternalReferenceRepository(externalReferences),
      group,
      licenses,
      version
    })
  }
}
