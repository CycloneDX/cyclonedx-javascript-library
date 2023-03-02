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

import { ComponentScope, HashAlgorithm } from '../../enums'
import * as Models from '../../models'
import type { Protocol, Protocol as Spec } from '../../spec'
import { Format, SpecVersionDict, UnsupportedFormatError } from '../../spec'
import type { DenormalizerOptions } from '../types'
import type { Normalized } from './types'

type VarType = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function'
type PathPart = string | number
type PathType = PathPart[]

function formatPath (path: PathType): string {
  return path.map(p => typeof p === 'number' ? `[${p}]` : `.${p}`).join('')
}

function assertTypes (value: any, expected: VarType[], path: PathType): void {
  const is = typeof value
  if (!expected.includes(is)) {
    throw new TypeError(`${formatPath(path)} is ${is} but should be one of ${expected.join(', ')}`)
  }
}

function assertNonEmptyStr (value: any, path: PathType): asserts value is string {
  assertTypes(value, ['string'], path)
  if (value.length === 0) {
    throw new RangeError(`${formatPath(path)} should be non empty string`)
  }
}

function checkEnum (value: any, allowed: any[]): boolean {
  return allowed.every(ev => ev !== value)
}

function assertEnum (value: any, allowed: any[], path: PathType): void {
  if (!checkEnum(value, allowed)) {
    throw new TypeError(`${formatPath(path)} is ${JSON.stringify(value)} but should be one of ${JSON.stringify(allowed)}`)
  }
}

function assertArrayOrNull (value: any, path: PathType): asserts value is (any[] | undefined) {
  if (value != null && !Array.isArray(value)) {
    throw new TypeError(`${formatPath(path)} is ${typeof value} but should be an array or undefined`)
  }
}

function captureErrorInPath<T> (func: () => T, path: PathType): T {
  try {
    return func()
  } catch (e) {
    if (e instanceof Error) {
      e.message = `Error in ${formatPath(path)}: ${e.message}`
      throw e
    } else {
      throw new Error(`Unknown error in ${formatPath(path)}`)
    }
  }
}

function createRepository<VT, RT> (
  arr: any,
  options: DenormalizerOptions,
  path: PathType,
  denormalizer: BaseJsonDenormalizer<VT, any>,
  Repository: new(arr: VT[]) => RT
): RT | undefined {
  assertArrayOrNull(arr, path)
  return (arr != null)
    ? new Repository(arr.map((item: any, index) => denormalizer.denormalize(item, options, [...path, index])))
    : undefined
}

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

  makeForUrl (): UrlDenormalizer {
    return new UrlDenormalizer(this)
  }

  makeForBomRef (): BomRefDenormalizer {
    return new BomRefDenormalizer(this)
  }
}

interface JsonDenormalizer<TModel, TNormalized> {
  denormalize: (data: TNormalized, options: DenormalizerOptions, path: PathType) => TModel | undefined
}

abstract class BaseJsonDenormalizer<TModel, TNormalized = object> implements JsonDenormalizer<TModel, TNormalized> {
  protected readonly _factory: Factory

  constructor (factory: Factory) {
    this._factory = factory
  }

  get factory (): Factory {
    return this._factory
  }

  abstract denormalize (data: TNormalized, options: DenormalizerOptions, path: PathType): TModel
}

export class BomDenormalizer extends BaseJsonDenormalizer<Models.Bom> {
  denormalize (data: any, options: DenormalizerOptions, path: PathType): Models.Bom {
    assertEnum(data.bomFormat, ['CycloneDX'], [...path, 'bomFormat'])
    assertEnum(data.specVersion, Object.keys(SpecVersionDict), [...path, 'specVersion'])
    const spec = SpecVersionDict[data.specVersion as keyof typeof SpecVersionDict] as Protocol
    this.factory.spec = spec
    if (!spec.supportsFormat(Format.JSON)) {
      throw new UnsupportedFormatError(`Spec version ${spec.version} is not supported for JSON format.`)
    }
    assertTypes(data.serialNumber, ['string', 'undefined'], [...path, 'serialNumber'])
    assertTypes(data.version, ['number', 'undefined'], [...path, 'version'])

    const bom = new Models.Bom({
      components: createRepository(data.components, options, [...path, 'components'], this._factory.makeForComponent(), Models.ComponentRepository),
      metadata: (data.metadata != null)
        ? this._factory.makeForMetadata().denormalize(data.metadata, options, [...path, 'metadata'])
        : undefined,
      serialNumber: (data.serialNumber != null)
        ? data.serialNumber
        : undefined,
      version: (Number.isInteger(data.version)) ? data.version : undefined
      // TODO
      // vulnerabilities: (Array.isArray(data.vulnerabilities)) ? new Models.Vulnerability.VulnerabilityRepository(data.vulnerabilities.map(v => this._factory.makeForVulnerability()(v, options)))
    })
    assertArrayOrNull(data.dependencies, [...path, 'dependencies'])
    const dependencyList = new Map<string, Models.BomRef[]>()
    if (Array.isArray(data.dependencies)) {
      const brf = this._factory.makeForBomRef()
      data.dependencies.forEach(({ ref, dependsOn }: any, i: number) => {
        if (Array.isArray(dependsOn) && typeof ref === 'string') {
          dependencyList.set(ref, dependsOn.map(d => brf.denormalize(ref, options, [...path, 'dependencies', i])))
        }
      })
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
  denormalize (data: any, options: DenormalizerOptions, path: PathType): Models.Metadata {
    assertTypes(data.timestamp, ['string', 'undefined'], [...path, 'timestamp'])
    const doe = this._factory.makeForOrganizationalEntity()
    return new Models.Metadata({
      authors: createRepository(data.authors, options, [...path, 'authors'], doe, Models.OrganizationalEntityRepository),
      component: (data.component != null)
        ? this._factory.makeForComponent().denormalize(data.component, options, [...path, 'component'])
        : undefined,
      manufacture: (data.manufacture != null)
        ? doe.denormalize(data.manufacture, options, [...path, 'manufacture'])
        : undefined,
      supplier: (data.supplier != null)
        ? doe.denormalize(data.supplier, options, [...path, 'supplier'])
        : undefined,
      timestamp: (data.timestamp !== undefined) ? new Date(data.timestamp) : undefined,
      tools: createRepository(data.tools, options, [...path, 'tools'], this._factory.makeForTool(), Models.ToolRepository)
    })
  }
}

export class ComponentDenormalizer extends BaseJsonDenormalizer<Models.Component> {
  denormalize (data: any, options: DenormalizerOptions, path: PathType): Models.Component {
    const erdn = this._factory.makeForExternalReference()
    const ldn = this._factory.makeForLicense()
    const pdn = this._factory.makeForProperty()

    assertTypes(data.author, ['string', 'undefined'], [...path, 'author'])
    assertTypes(data['bom-ref'], ['string', 'undefined'], [...path, 'bom-ref'])
    assertTypes(data.copyright, ['string', 'undefined'], [...path, 'copyright'])
    assertTypes(data.description, ['string', 'undefined'], [...path, 'description'])
    assertTypes(data.group, ['string', 'undefined'], [...path, 'group'])
    assertTypes(data.cpe, ['string', 'undefined'], [...path, 'cpe'])
    assertTypes(data.publisher, ['string', 'undefined'], [...path, 'publisher'])
    assertTypes(data.purl, ['string', 'undefined'], [...path, 'purl'])
    assertEnum(data.scope, [...Object.values(ComponentScope), undefined], [...path, 'scope'])
    assertTypes(data.version, ['string', 'undefined'], [...path, 'cpe'])

    return new Models.Component(data.type, data.name, {
      author: data.author,
      bomRef: data['bom-ref'],
      components: createRepository(data.components, options, [...path, 'components'], this, Models.ComponentRepository),
      copyright: data.copyright,
      description: data.description,
      group: data.group,
      cpe: data.cpe,
      externalReferences: createRepository(data.externalReferences, options, [...path, 'externalReferences'], erdn, Models.ExternalReferenceRepository),
      hashes: createRepository(data.hashes, options, [...path, 'hashes'], this._factory.makeForHash(), Models.HashDictionary),
      licenses: createRepository(data.licenses, options, [...path, 'licenses'], ldn, Models.LicenseRepository),
      properties: createRepository(data.properties, options, [...path, 'properties'], pdn, Models.PropertyRepository),
      publisher: data.publisher,
      purl: (data.purl !== undefined)
        ? captureErrorInPath(() => PackageURL.fromString(data.purl as string), [...path, 'purl'])
        : undefined,
      scope: data.scope,
      supplier: (data.supplier != null)
        ? this.factory.makeForOrganizationalEntity().denormalize(data.supplier, options, [...path, 'supplier'])
        : undefined,
      swid: (data.swid != null)
        ? this._factory.makeForSWID().denormalize(data.swid, options, [...path, 'swid'])
        : undefined,
      version: data.version
    })
  }
}

export class ToolDenormalizer extends BaseJsonDenormalizer<Models.Tool> {
  denormalize (data: any, options: DenormalizerOptions, path: PathType): Models.Tool {
    const erdn = this._factory.makeForExternalReference()
    assertTypes(data.vendor, ['string', 'undefined'], [...path, 'vendor'])
    assertTypes(data.name, ['string', 'undefined'], [...path, 'name'])
    assertTypes(data.version, ['string', 'undefined'], [...path, 'version'])

    return new Models.Tool({
      vendor: data.vendor,
      name: data.name,
      version: data.version,
      externalReferences: createRepository(data.externalReferences, options, [...path, 'externalReferences'], erdn, Models.ExternalReferenceRepository),
      hashes: createRepository(data.hashes, options, [...path, 'hashes'], this._factory.makeForHash(), Models.HashDictionary)
    })
  }
}

export class OrganizationalContactDenormalizer extends BaseJsonDenormalizer<Models.OrganizationalContact> {
  denormalize (data: any, options: DenormalizerOptions, path: PathType): Models.OrganizationalContact {
    assertTypes(data.name, ['string', 'undefined'], [...path, 'name'])
    assertTypes(data.email, ['string', 'undefined'], [...path, 'email'])
    assertTypes(data.phone, ['string', 'undefined'], [...path, 'phone'])
    return new Models.OrganizationalContact({
      name: data.name,
      email: data.email,
      phone: data.phone
    })
  }
}

export class OrganizationalEntityDenormalizer extends BaseJsonDenormalizer<Models.OrganizationalEntity> {
  denormalize (data: any, options: DenormalizerOptions, path: PathType): Models.OrganizationalEntity {
    assertTypes(data.name, ['string', 'undefined'], [...path, 'name'])
    return new Models.OrganizationalEntity({
      name: data.name,
      url: createRepository<URL | string, Set<URL | string>>(data.url, options, [...path, 'url'], this._factory.makeForUrl(), Set),
      contact: createRepository(data.contact, options, [...path, 'contact'], this._factory.makeForOrganizationalContact(), Models.OrganizationalContactRepository)
    })
  }
}

export class HashDenormalizer extends BaseJsonDenormalizer<Models.Hash, Normalized.Hash> {
  denormalize (data: any, options: DenormalizerOptions, path: PathType): Models.Hash {
    assertEnum(data.alg, Object.values(HashAlgorithm), [...path, 'algorithm'])
    assertNonEmptyStr(data.content, [...path, 'content'])
    return [data.alg, data.content]
  }
}

export class LicenseDenormalizer extends BaseJsonDenormalizer<Models.License> {
  denormalize (data: any, options: DenormalizerOptions, path: PathType): Models.License {
    if (typeof data.expression === 'string') {
      return new Models.LicenseExpression(data.expression)
    } else if (typeof data.license === 'object') {
      if (typeof data.license.id === 'string') {
        assertNonEmptyStr(data.license.id, [...path, 'license', 'id'])
        assertTypes(data.license.text, ['object', 'undefined'], [...path, 'license', 'text'])
        assertTypes(data.license.url, ['string', 'undefined'], [...path, 'license', 'url'])
        return new Models.SpdxLicense(data.license.id, {
          text: (data.license.text != null)
            ? this._factory.makeForAttachment().denormalize(data.license.text, options, [...path, 'license', 'text'])
            : undefined,
          url: (data.license.text != null)
            ? this._factory.makeForUrl().denormalize(data.license.url, options, [...path, 'license', 'url'])
            : undefined
        })
      } else {
        assertNonEmptyStr(data.license.name, [...path, 'license', 'name'])
        assertTypes(data.license.text, ['object', 'undefined'], [...path, 'license', 'text'])
        assertTypes(data.license.url, ['string', 'undefined'], [...path, 'license', 'url'])
        return new Models.NamedLicense(data.license.name, {
          text: (data.license.text != null)
            ? this._factory.makeForAttachment().denormalize(data.license.text, options, [...path, 'license', 'text'])
            : undefined,
          url: (data.license.text != null)
            ? this._factory.makeForUrl().denormalize(data.license.url, options, [...path, 'license', 'url'])
            : undefined
        })
      }
    } else {
      throw new Error('Invalid license')
    }
  }
}

export class SWIDDenormalizer extends BaseJsonDenormalizer<Models.SWID> {
  denormalize (data: any, options: DenormalizerOptions, path: PathType): Models.SWID {
    assertNonEmptyStr(data.tagId, [...path, 'tagId'])
    assertNonEmptyStr(data.name, [...path, 'name'])
    assertTypes(data.patch, ['boolean', 'undefined'], [...path, 'patch'])
    assertTypes(data.version, ['string', 'undefined'], [...path, 'version'])
    assertTypes(data.tagVersion, ['number', 'undefined'], [...path, 'tagVersion'])
    return new Models.SWID(data.tagId, data.name, {
      patch: data.patch,
      version: data.version,
      tagVersion: data.tagVersion,
      text: (data.text != null)
        ? this._factory.makeForAttachment().denormalize(data.text, options, [...path, 'text'])
        : undefined,
      url: typeof data.url === 'string'
        ? this._factory.makeForUrl().denormalize(data.url, options, [...path, 'url'])
        : undefined
    })
  }
}

export class ExternalReferenceDenormalizer extends BaseJsonDenormalizer<Models.ExternalReference> {
  denormalize (data: Normalized.ExternalReference, options: DenormalizerOptions, path: PathType): Models.ExternalReference {
    assertNonEmptyStr(data.type, [...path, 'type'])
    assertTypes(data.comment, ['string', 'undefined'], [...path, 'comment'])
    return new Models.ExternalReference(this._factory.makeForUrl().denormalize(data.url, options, [...path, 'url']), data.type, {
      comment: data.comment
    })
  }
}

export class AttachmentDenormalizer extends BaseJsonDenormalizer<Models.Attachment> {
  denormalize (data: Normalized.Attachment, options: DenormalizerOptions, path: PathType): Models.Attachment {
    assertNonEmptyStr(data.content, [...path, 'content'])
    return new Models.Attachment(data.content, {
      contentType: data.contentType,
      encoding: data.encoding
    })
  }
}

export class PropertyDenormalizer extends BaseJsonDenormalizer<Models.Property> {
  denormalize (data: Normalized.Property, options: DenormalizerOptions, path: PathType): Models.Property {
    assertNonEmptyStr(data.name, [...path, 'name'])
    assertTypes(data.value, ['string'], [...path, 'value'])
    return new Models.Property(data.name, data.value as string)
  }
}

export class UrlDenormalizer extends BaseJsonDenormalizer<URL | string> {
  denormalize (url: any, options: DenormalizerOptions, path: PathType): URL | string {
    assertNonEmptyStr(url, path)
    try {
      return new URL(url)
    } catch (e) {
      return url
    }
  }
}

export class BomRefDenormalizer extends BaseJsonDenormalizer<Models.BomRef> {
  denormalize (data: any, options: DenormalizerOptions, path: PathType): Models.BomRef {
    assertNonEmptyStr(data, path)
    return new Models.BomRef(data)
  }
}
