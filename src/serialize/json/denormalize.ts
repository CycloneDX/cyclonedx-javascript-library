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

import { PackageURL } from 'packageurl-js'
import { URL } from 'url'

import * as Models from '../../models'
import type { Protocol as Spec, Version as SpecVersion } from '../../spec'
import { SpecVersionDict, UnsupportedFormatError } from '../../spec'
import type { DenormalizerOptions } from '../types'
import type { Normalized } from './types'

export class Factory {
  #spec?: Spec

  get spec (): Spec | undefined {
    return this.#spec
  }

  set spec (spec: Spec | undefined) {
    this.#spec = spec
  }

  makeForBom (): BomDenormalizer {
    return new BomDenormalizer(this)
  }

  makeForMetadata (): MetadataDenormalizer {
    return new MetadataDenormalizer(this)
  }

  makeForComponent (): ComponentDenormalizer {
    return new ComponentDenormalizer(this)
  }

  makeForTool (): ToolDenormalizer {
    return new ToolDenormalizer(this)
  }

  makeForOrganizationalContact (): OrganizationalContactDenormalizer {
    return new OrganizationalContactDenormalizer(this)
  }

  makeForOrganizationalEntity (): OrganizationalEntityDenormalizer {
    return new OrganizationalEntityDenormalizer(this)
  }

  makeForHash (): HashDenormalizer {
    return new HashDenormalizer(this)
  }

  makeForLicense (): LicenseDenormalizer {
    return new LicenseDenormalizer(this)
  }

  makeForSWID (): SWIDDenormalizer {
    return new SWIDDenormalizer(this)
  }

  makeForExternalReference (): ExternalReferenceDenormalizer {
    return new ExternalReferenceDenormalizer(this)
  }

  makeForAttachment (): AttachmentDenormalizer {
    return new AttachmentDenormalizer(this)
  }

  makeForProperty (): PropertyDenormalizer {
    return new PropertyDenormalizer(this)
  }

  makeForUrl (): (url: string, options: DenormalizerOptions) => (URL | string) {
    return (u, o) => denormalizeUrl(u, o, this)
  }
}

interface JsonDenormalizer<TModel, TNormalized> {
  denormalize: (data: TNormalized, options: DenormalizerOptions) => TModel | undefined
}

abstract class BaseJsonDenormalizer<TModel, TNormalized = object> implements JsonDenormalizer<TModel, TNormalized> {
  protected readonly _factory: Factory

  constructor (factory: Factory) {
    this._factory = factory
  }

  get factory (): Factory {
    return this._factory
  }

  abstract denormalize (data: TNormalized, options: DenormalizerOptions): TModel | undefined
}

export class BomDenormalizer extends BaseJsonDenormalizer<Models.Bom> {
  denormalize (data: Normalized.Bom, options: DenormalizerOptions): Models.Bom {
    const spec = SpecVersionDict[data.specVersion as SpecVersion]
    if (spec === undefined) {
      throw new UnsupportedFormatError(`Spec version ${data.specVersion} is not supported.`)
    }
    this.factory.spec = spec
    if (!this.factory.spec.supportsFormat('json')) {
      throw new UnsupportedFormatError(`Spec version ${data.specVersion} is not supported for JSON format.`)
    }
    const bom = new Models.Bom({
      metadata: (data.metadata != null) ? this._factory.makeForMetadata().denormalize(data.metadata, options) : undefined,
      components: (data.components != null) ? new Models.ComponentRepository(data.components.map(c => this._factory.makeForComponent().denormalize(c, options))) : undefined,
      serialNumber: data.serialNumber,
      version: data.version
    })
    const dependencyList = new Map<string, Models.BomRef[]>()
    if (Array.isArray(data.dependencies)) {
      for (const { ref, dependsOn } of data.dependencies) {
        if (dependsOn != null) {
          dependencyList.set(ref, dependsOn.map(d => new Models.BomRef(d)))
        }
      }
    }
    if ((bom.metadata?.component) != null) {
      this.#addDepsToComponent(bom.metadata.component, dependencyList)
    }
    for (const component of bom.components) {
      this.#addDepsToComponent(component, dependencyList)
    }
    return bom
  }

  #addDepsToComponent (component: Models.Component, dependencyList: Map<string, Models.BomRef[]>): void {
    const deps = dependencyList.get(component.bomRef.toString())
    if (deps != null) {
      for (const dep of deps) {
        component.dependencies.add(dep)
      }
    }
    for (const subcomponent of component.components) {
      this.#addDepsToComponent(subcomponent, dependencyList)
    }
  }
}

export class MetadataDenormalizer extends BaseJsonDenormalizer<Models.Metadata> {
  denormalize (data: Normalized.Metadata, options: DenormalizerOptions): Models.Metadata {
    return new Models.Metadata({
      authors: (data.authors != null) ? new Models.OrganizationalEntityRepository(data.authors.map(a => this._factory.makeForOrganizationalEntity().denormalize(a, options))) : undefined,
      component: (data.component != null) ? this._factory.makeForComponent().denormalize(data.component, options) : undefined,
      manufacture: (data.manufacture != null) ? this._factory.makeForOrganizationalEntity().denormalize(data.manufacture, options) : undefined,
      supplier: (data.supplier != null) ? this._factory.makeForOrganizationalEntity().denormalize(data.supplier, options) : undefined,
      timestamp: (data.timestamp !== undefined) ? new Date(data.timestamp) : undefined,
      tools: (data.tools != null) ? new Models.ToolRepository(data.tools.map(t => this._factory.makeForTool().denormalize(t, options))) : undefined
    })
  }
}

export class ComponentDenormalizer extends BaseJsonDenormalizer<Models.Component> {
  denormalize (data: Normalized.Component, options: DenormalizerOptions): Models.Component {
    const erdn = this._factory.makeForExternalReference()
    const ldn = this._factory.makeForLicense()
    const pdn = this._factory.makeForProperty()
    return new Models.Component(data.type, data.name, {
      author: data.author,
      bomRef: data['bom-ref'],
      components: (data.components != null) ? new Models.ComponentRepository(data.components.map(c => this.denormalize(c, options))) : undefined,
      copyright: data.copyright,
      description: data.description,
      group: data.group,
      cpe: data.cpe,
      externalReferences: (data.externalReferences != null)
        ? new Models.ExternalReferenceRepository(data.externalReferences.map(er => erdn.denormalize(er, options)))
        : undefined,
      hashes: (data.hashes != null) ? new Models.HashDictionary(data.hashes.map(h => this._factory.makeForHash().denormalize(h, options))) : undefined,
      licenses: (data.licenses != null) ? new Models.LicenseRepository(data.licenses.map(l => ldn.denormalize(l, options))) : undefined,
      properties: (data.properties != null) ? new Models.PropertyRepository(data.properties.map(p => pdn.denormalize(p, options))) : undefined,
      publisher: data.publisher,
      purl: (data.purl !== undefined) ? PackageURL.fromString(data.purl) : undefined,
      scope: data.scope,
      supplier: (data.supplier != null) ? this.factory.makeForOrganizationalEntity().denormalize(data.supplier, options) : undefined,
      swid: (data.swid != null) ? this._factory.makeForSWID().denormalize(data.swid, options) : undefined,
      version: data.version
    })
  }
}

export class ToolDenormalizer extends BaseJsonDenormalizer<Models.Tool> {
  denormalize (data: Normalized.Tool, options: DenormalizerOptions): Models.Tool {
    const erdn = this._factory.makeForExternalReference()
    return new Models.Tool({
      vendor: data.vendor,
      name: data.name,
      version: data.version,
      externalReferences: (data.externalReferences != null)
        ? new Models.ExternalReferenceRepository(data.externalReferences.map(er => erdn.denormalize(er, options)))
        : undefined,
      hashes: (data.hashes != null) ? new Models.HashDictionary(data.hashes.map(h => this._factory.makeForHash().denormalize(h, options))) : undefined
    })
  }
}

export class OrganizationalContactDenormalizer extends BaseJsonDenormalizer<Models.OrganizationalContact> {
  denormalize (data: Normalized.OrganizationalContact, options: DenormalizerOptions): Models.OrganizationalContact {
    return new Models.OrganizationalContact({
      name: data.name,
      email: data.email,
      phone: data.phone
    })
  }
}

export class OrganizationalEntityDenormalizer extends BaseJsonDenormalizer<Models.OrganizationalEntity> {
  denormalize (data: Normalized.OrganizationalEntity, options: DenormalizerOptions): Models.OrganizationalEntity {
    return new Models.OrganizationalEntity({
      name: data.name,
      url: (data.url != null) ? new Set(data.url.map(u => this._factory.makeForUrl()(u, options))) : undefined,
      contact: (data.contact != null) ? new Models.OrganizationalContactRepository(data.contact.map(c => this._factory.makeForOrganizationalContact().denormalize(c, options))) : undefined
    })
  }
}

export class HashDenormalizer extends BaseJsonDenormalizer<Models.Hash, Normalized.Hash> {
  denormalize (data: Normalized.Hash, options: DenormalizerOptions): Models.Hash {
    return [data.alg, data.content]
  }
}

export class LicenseDenormalizer extends BaseJsonDenormalizer<Models.License> {
  denormalize (data: Normalized.License, options: DenormalizerOptions): Models.License {
    if (typeof (data as Normalized.LicenseExpression).expression === 'string') {
      return new Models.LicenseExpression((data as Normalized.LicenseExpression).expression)
    } else if (typeof (data as Normalized.SpdxLicense).license === 'object') {
      if (typeof (data as Normalized.SpdxLicense).license.id === 'string') {
        const sl = data as Normalized.SpdxLicense
        return new Models.SpdxLicense(sl.license.id, {
          text: (sl.license.text != null) ? this._factory.makeForAttachment().denormalize(sl.license.text, options) : undefined,
          url: typeof sl.license.url === 'string' ? this._factory.makeForUrl()(sl.license.url, options) : undefined
        })
      } else {
        const nl = data as Normalized.NamedLicense
        return new Models.NamedLicense(nl.license.name, {
          text: (nl.license.text != null) ? this._factory.makeForAttachment().denormalize(nl.license.text, options) : undefined,
          url: typeof nl.license.url === 'string' ? this._factory.makeForUrl()(nl.license.url, options) : undefined
        })
      }
    } else {
      throw new Error('Invalid license')
    }
  }
}

export class SWIDDenormalizer extends BaseJsonDenormalizer<Models.SWID> {
  denormalize (data: Normalized.SWID, options: DenormalizerOptions): Models.SWID {
    if (typeof data.tagId !== 'string') {
      throw new Error('SWID tagId is required')
    }
    return new Models.SWID(data.tagId, data.name, {
      patch: data.patch,
      version: data.version,
      tagVersion: data.tagVersion,
      text: (data.text != null) ? this._factory.makeForAttachment().denormalize(data.text, options) : undefined,
      url: typeof data.url === 'string' ? this._factory.makeForUrl()(data.url, options) : undefined
    })
  }
}

export class ExternalReferenceDenormalizer extends BaseJsonDenormalizer<Models.ExternalReference> {
  denormalize (data: Normalized.ExternalReference, options: DenormalizerOptions): Models.ExternalReference {
    if (typeof data.url !== 'string' || typeof data.type !== 'string') {
      throw new Error('External reference URL and type are required')
    }
    return new Models.ExternalReference(this._factory.makeForUrl()(data.url, options), data.type, {
      comment: data.comment
    })
  }
}

export class AttachmentDenormalizer extends BaseJsonDenormalizer<Models.Attachment> {
  denormalize (data: Normalized.Attachment, options: DenormalizerOptions): Models.Attachment {
    if (typeof data.content !== 'string') {
      throw new Error('Attachment content is required')
    }
    return new Models.Attachment(data.content, {
      contentType: data.contentType,
      encoding: data.encoding
    })
  }
}

export class PropertyDenormalizer extends BaseJsonDenormalizer<Models.Property> {
  denormalize (data: Normalized.Property, options: DenormalizerOptions): Models.Property {
    if (typeof data.name !== 'string' || typeof data.value !== 'string') {
      throw new Error('Property key and value are required')
    }
    return new Models.Property(data.name, data.value)
  }
}

export function denormalizeUrl (url: string, options: DenormalizerOptions, factory: Factory): URL | string {
  try {
    return new URL(url)
  } catch (e) {
    return url
  }
}
