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

import { AttachmentEncoding, ComponentScope, ExternalReferenceType, HashAlgorithm } from '../../enums'
import * as Models from '../../models'
import type { Protocol, Protocol as Spec } from '../../spec'
import { Format, SpecVersionDict, UnsupportedFormatError } from '../../spec'
import type { JSONDenormalizerOptions, JSONDenormalizerWarning, PathType } from '../types'
import type { Normalized } from './types'

interface JSONDenormalizerContext {
  options: JSONDenormalizerOptions
  spec: Spec
}

function formatPath (path: PathType): string {
  return path.map(p => typeof p === 'number' ? `[${p}]` : `.${p}`).join('')
}

function assertString (value: unknown, path: PathType): asserts value is string {
  if (typeof value !== 'string') {
    throw new TypeError(`${formatPath(path)} is ${typeof value} but should be a string`)
  }
}

function assertNonEmptyStr (value: unknown, path: PathType): asserts value is string {
  assertString(value, path)
  if (value.length === 0) {
    throw new RangeError(`${formatPath(path)} should be non empty string`)
  }
}

function assertEnum<KT> (value: unknown, allowed: KT[], path: PathType): asserts value is KT {
  if (!allowed.includes(value as any)) {
    throw new TypeError(`${formatPath(path)} is ${JSON.stringify(value)} but should be one of ${JSON.stringify(allowed)}`)
  }
}

function throwWarning (warning: JSONDenormalizerWarning): never {
  switch (warning.type) {
    case 'type':
      throw new TypeError(`${formatPath(warning.path)} is ${typeof warning.value} but should be a ${warning.expected}`)
    case 'value':
      throw new RangeError(`${formatPath(warning.path)} has invalid value: ${warning.message}`)
    default:
      throw new Error(`invalid warning object: ${JSON.stringify(warning)}`)
  }
}

function callWarnFunc (ctx: JSONDenormalizerContext, warning: JSONDenormalizerWarning): void | never {
  if (typeof ctx.options.warningFunc !== 'function') {
    throwWarning(warning)
  } else {
    ctx.options.warningFunc(warning)
  }
}

function unifyNullUndef<T> (value: T | null | undefined): T | undefined {
  if (value == null) {
    return undefined
  }
  return value
}

function warnStringOrUndef (value: unknown, ctx: JSONDenormalizerContext, path: PathType): string | undefined {
  if (value != null && typeof value !== 'string') {
    callWarnFunc(ctx, {
      type: 'type',
      actual: typeof value,
      expected: 'string',
      nullAllowed: true,
      path,
      value
    })
    return undefined
  }
  return unifyNullUndef(value)
}

function warnBoolOrUndef (value: unknown, ctx: JSONDenormalizerContext, path: PathType): boolean | undefined {
  if (value != null && typeof value !== 'boolean') {
    callWarnFunc(ctx, {
      type: 'type',
      actual: typeof value,
      expected: 'boolean',
      nullAllowed: true,
      path,
      value
    })
    return undefined
  }
  return unifyNullUndef(value)
}

function warnRecordOrUndef (value: unknown, ctx: JSONDenormalizerContext, path: PathType): object | undefined {
  if (value != null && (typeof value !== 'object')) {
    callWarnFunc(ctx, {
      type: 'type',
      actual: typeof value,
      expected: '_record',
      nullAllowed: true,
      path,
      value
    })
    return undefined
  }
  return unifyNullUndef(value)
}

function warnEnumOrUndef<KT> (value: unknown, allowed: KT[], ctx: JSONDenormalizerContext, path: PathType): KT | undefined {
  if (value != null && !allowed.includes(value as any)) {
    callWarnFunc(ctx, {
      type: 'value',
      path,
      value,
      message: `should be one of ${JSON.stringify(allowed)}`
    })
    return undefined
  }
  return unifyNullUndef(value as KT)
}

function warnNumberOrUndef (value: any, ctx: JSONDenormalizerContext, path: PathType): number | undefined {
  if (value != null && typeof value !== 'number') {
    callWarnFunc(ctx, {
      type: 'type',
      actual: typeof value,
      expected: 'number',
      nullAllowed: true,
      path,
      value
    })
    return undefined
  }
  return value
}

function warnArrayOrUndef (value: any, ctx: JSONDenormalizerContext, path: PathType): any[] | undefined {
  if (value != null && !Array.isArray(value)) {
    callWarnFunc(ctx, {
      type: 'type',
      actual: typeof value,
      expected: '_array',
      nullAllowed: true,
      path,
      value
    })
    return undefined
  }
  return value
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
  arr: unknown,
  ctx: JSONDenormalizerContext,
  path: PathType,
  denormalizer: BaseJsonDenormalizer<VT, any>,
  Repository: new(arr: VT[]) => RT
): RT | undefined {
  const arr2 = warnArrayOrUndef(arr, ctx, path)
  return (arr2 != null)
    ? new Repository(arr2.map((item: any, index: number) => denormalizer.denormalize(item, ctx, [...path, index])))
    : undefined
}

export class Factory {
  makeForBom (ctx: Omit<JSONDenormalizerContext, 'spec'>): BomDenormalizer {
    return new BomDenormalizer(this)
  }

  makeForMetadata (ctx: JSONDenormalizerContext): MetadataDenormalizer {
    return new MetadataDenormalizer(this)
  }

  makeForComponent (ctx: JSONDenormalizerContext): ComponentDenormalizer {
    return new ComponentDenormalizer(this)
  }

  makeForTool (ctx: JSONDenormalizerContext): ToolDenormalizer {
    return new ToolDenormalizer(this)
  }

  makeForOrganizationalContact (ctx: JSONDenormalizerContext): OrganizationalContactDenormalizer {
    return new OrganizationalContactDenormalizer(this)
  }

  makeForOrganizationalEntity (ctx: JSONDenormalizerContext): OrganizationalEntityDenormalizer {
    return new OrganizationalEntityDenormalizer(this)
  }

  makeForHash (ctx: JSONDenormalizerContext): HashDenormalizer {
    return new HashDenormalizer(this)
  }

  makeForLicense (ctx: JSONDenormalizerContext): LicenseDenormalizer {
    return new LicenseDenormalizer(this)
  }

  makeForSWID (ctx: JSONDenormalizerContext): SWIDDenormalizer {
    return new SWIDDenormalizer(this)
  }

  makeForExternalReference (ctx: JSONDenormalizerContext): ExternalReferenceDenormalizer {
    return new ExternalReferenceDenormalizer(this)
  }

  makeForAttachment (ctx: JSONDenormalizerContext): AttachmentDenormalizer {
    return new AttachmentDenormalizer(this)
  }

  makeForProperty (ctx: JSONDenormalizerContext): PropertyDenormalizer {
    return new PropertyDenormalizer(this)
  }

  makeForUrl (ctx: JSONDenormalizerContext): UrlDenormalizer {
    return new UrlDenormalizer(this)
  }

  makeForBomRef (ctx: JSONDenormalizerContext): BomRefDenormalizer {
    return new BomRefDenormalizer(this)
  }
}

interface JsonDenormalizer<TModel, TNormalized> {
  denormalize: (data: TNormalized, ctx: JSONDenormalizerContext, path: PathType) => TModel | undefined
}

abstract class BaseJsonDenormalizer<TModel, TNormalized = Record<string, any>> implements JsonDenormalizer<TModel, TNormalized> {
  protected readonly _factory: Factory

  constructor (factory: Factory) {
    this._factory = factory
  }

  get factory (): Factory {
    return this._factory
  }

  abstract denormalize (data: TNormalized, ctx: JSONDenormalizerContext, path: PathType): TModel
}

export class BomDenormalizer extends BaseJsonDenormalizer<Models.Bom> {
  denormalize (data: Record<string, any>, ctx: JSONDenormalizerContext, path: PathType): Models.Bom {
    assertEnum(data.bomFormat, ['CycloneDX'], [...path, 'bomFormat'])
    assertEnum(data.specVersion, Object.keys(SpecVersionDict), [...path, 'specVersion'])
    const spec = SpecVersionDict[data.specVersion as keyof typeof SpecVersionDict] as Protocol
    if (!spec.supportsFormat(Format.JSON)) {
      throw new UnsupportedFormatError(`Spec version ${spec.version} is not supported for JSON format.`)
    }

    const bom = new Models.Bom({
      components: createRepository(data.components, ctx, [...path, 'components'], this._factory.makeForComponent(ctx), Models.ComponentRepository),
      metadata: (data.metadata != null)
        ? this._factory.makeForMetadata(ctx).denormalize(data.metadata, ctx, [...path, 'metadata'])
        : undefined,
      serialNumber: warnStringOrUndef(data.serialNumber, ctx, [...path, 'serialNumber']) !== undefined
        ? data.serialNumber
        : undefined,
      version: warnNumberOrUndef(data.version, ctx, [...path, 'version']) !== undefined ? data.version : undefined
      // TODO
      // vulnerabilities: (Array.isArray(data.vulnerabilities)) ? new Models.Vulnerability.VulnerabilityRepository(data.vulnerabilities.map(v => this._factory.makeForVulnerability()(v, options)))
    })
    const deps = warnArrayOrUndef(data.dependencies, ctx, [...path, 'dependencies'])
    const dependencyList = new Map<string, Models.BomRef[]>()
    if (deps !== undefined) {
      const brf = this._factory.makeForBomRef(ctx)
      deps.forEach(({ ref, dependsOn }: any, i: number) => {
        if (Array.isArray(dependsOn) && typeof ref === 'string') {
          dependencyList.set(ref, dependsOn.map(d => brf.denormalize(ref, ctx, [...path, 'dependencies', i])))
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
  denormalize (data: Record<string, any>, ctx: JSONDenormalizerContext, path: PathType): Models.Metadata {
    const doe = this._factory.makeForOrganizationalEntity(ctx)
    return new Models.Metadata({
      authors: createRepository(data.authors, ctx, [...path, 'authors'], doe, Models.OrganizationalEntityRepository),
      component: (data.component != null)
        ? this._factory.makeForComponent(ctx).denormalize(data.component, ctx, [...path, 'component'])
        : undefined,
      manufacture: (data.manufacture != null)
        ? doe.denormalize(data.manufacture, ctx, [...path, 'manufacture'])
        : undefined,
      supplier: (data.supplier != null)
        ? doe.denormalize(data.supplier, ctx, [...path, 'supplier'])
        : undefined,
      timestamp: (warnStringOrUndef(data.timestamp, ctx, [...path, 'timestamp']) !== undefined)
        ? new Date(data.timestamp)
        : undefined,
      tools: createRepository(data.tools, ctx, [...path, 'tools'], this._factory.makeForTool(ctx), Models.ToolRepository)
    })
  }
}

export class ComponentDenormalizer extends BaseJsonDenormalizer<Models.Component> {
  denormalize (data: Record<string, any>, ctx: JSONDenormalizerContext, path: PathType): Models.Component {
    const erdn = this._factory.makeForExternalReference(ctx)
    const ldn = this._factory.makeForLicense(ctx)
    const pdn = this._factory.makeForProperty(ctx)
    return new Models.Component(data.type, data.name, {
      author: warnStringOrUndef(data.author, ctx, [...path, 'author']),
      bomRef: warnStringOrUndef(data['bom-ref'], ctx, [...path, 'bom-ref']),
      components: createRepository(data.components, ctx, [...path, 'components'], this, Models.ComponentRepository),
      copyright: warnStringOrUndef(data.copyright, ctx, [...path, 'copyright']),
      description: warnStringOrUndef(data.description, ctx, [...path, 'description']),
      group: warnStringOrUndef(data.group, ctx, [...path, 'group']),
      cpe: warnStringOrUndef(data.cpe, ctx, [...path, 'cpe']),
      externalReferences: createRepository(data.externalReferences, ctx, [...path, 'externalReferences'], erdn, Models.ExternalReferenceRepository),
      hashes: createRepository(data.hashes, ctx, [...path, 'hashes'], this._factory.makeForHash(ctx), Models.HashDictionary),
      licenses: createRepository(data.licenses, ctx, [...path, 'licenses'], ldn, Models.LicenseRepository),
      properties: createRepository(data.properties, ctx, [...path, 'properties'], pdn, Models.PropertyRepository),
      publisher: warnStringOrUndef(data.publisher, ctx, [...path, 'publisher']),
      purl: (warnStringOrUndef(data.purl, ctx, [...path, 'purl']) !== undefined)
        ? captureErrorInPath(() => PackageURL.fromString(data.purl as string), [...path, 'purl'])
        : undefined,
      scope: warnEnumOrUndef(data.scope, Object.values(ComponentScope), ctx, [...path, 'scope']),
      supplier: (data.supplier != null)
        ? this.factory.makeForOrganizationalEntity(ctx).denormalize(data.supplier, ctx, [...path, 'supplier'])
        : undefined,
      swid: (data.swid != null)
        ? this._factory.makeForSWID(ctx).denormalize(data.swid, ctx, [...path, 'swid'])
        : undefined,
      version: warnStringOrUndef(data.version, ctx, [...path, 'version'])
    })
  }
}

export class ToolDenormalizer extends BaseJsonDenormalizer<Models.Tool> {
  denormalize (data: Record<string, any>, ctx: JSONDenormalizerContext, path: PathType): Models.Tool {
    const erdn = this._factory.makeForExternalReference(ctx)
    return new Models.Tool({
      vendor: warnStringOrUndef(data.vendor, ctx, [...path, 'vendor']),
      name: warnStringOrUndef(data.name, ctx, [...path, 'name']),
      version: warnStringOrUndef(data.version, ctx, [...path, 'version']),
      externalReferences: createRepository(data.externalReferences, ctx, [...path, 'externalReferences'], erdn, Models.ExternalReferenceRepository),
      hashes: createRepository(data.hashes, ctx, [...path, 'hashes'], this._factory.makeForHash(ctx), Models.HashDictionary)
    })
  }
}

export class OrganizationalContactDenormalizer extends BaseJsonDenormalizer<Models.OrganizationalContact> {
  denormalize (data: Record<string, any>, ctx: JSONDenormalizerContext, path: PathType): Models.OrganizationalContact {
    return new Models.OrganizationalContact({
      name: warnStringOrUndef(data.name, ctx, [...path, 'name']),
      email: warnStringOrUndef(data.email, ctx, [...path, 'email']),
      phone: warnStringOrUndef(data.phone, ctx, [...path, 'phone'])
    })
  }
}

export class OrganizationalEntityDenormalizer extends BaseJsonDenormalizer<Models.OrganizationalEntity> {
  denormalize (data: Record<string, any>, ctx: JSONDenormalizerContext, path: PathType): Models.OrganizationalEntity {
    return new Models.OrganizationalEntity({
      name: warnStringOrUndef(data.name, ctx, [...path, 'name']),
      url: createRepository<URL | string, Set<URL | string>>(data.url, ctx, [...path, 'url'], this._factory.makeForUrl(ctx), Set),
      contact: createRepository(data.contact, ctx, [...path, 'contact'], this._factory.makeForOrganizationalContact(ctx), Models.OrganizationalContactRepository)
    })
  }
}

export class HashDenormalizer extends BaseJsonDenormalizer<Models.Hash, Normalized.Hash> {
  denormalize (data: Record<string, any>, ctx: JSONDenormalizerContext, path: PathType): Models.Hash {
    assertEnum(data.alg, Object.values(HashAlgorithm), [...path, 'algorithm'])
    assertNonEmptyStr(data.content, [...path, 'content'])
    return [data.alg, data.content]
  }
}

export class LicenseDenormalizer extends BaseJsonDenormalizer<Models.License> {
  denormalize (data: Record<string, any>, ctx: JSONDenormalizerContext, path: PathType): Models.License {
    if (typeof data.expression === 'string') {
      return new Models.LicenseExpression(data.expression)
    } else if (typeof data.license === 'object') {
      if (typeof data.license.id === 'string') {
        assertNonEmptyStr(data.license.id, [...path, 'license', 'id'])
        warnRecordOrUndef(data.license.text, ctx, [...path, 'license', 'text'])
        warnStringOrUndef(data.license.url, ctx, [...path, 'license', 'url'])
        return new Models.SpdxLicense(data.license.id, {
          text: (data.license.text != null)
            ? this._factory.makeForAttachment(ctx).denormalize(data.license.text, ctx, [...path, 'license', 'text'])
            : undefined,
          url: (data.license.text != null)
            ? this._factory.makeForUrl(ctx).denormalize(data.license.url, ctx, [...path, 'license', 'url'])
            : undefined
        })
      } else {
        assertNonEmptyStr(data.license.name, [...path, 'license', 'name'])
        warnRecordOrUndef(data.license.text, ctx, [...path, 'license', 'text'])
        warnStringOrUndef(data.license.url, ctx, [...path, 'license', 'url'])
        return new Models.NamedLicense(data.license.name, {
          text: (data.license.text != null)
            ? this._factory.makeForAttachment(ctx).denormalize(data.license.text, ctx, [...path, 'license', 'text'])
            : undefined,
          url: (data.license.text != null)
            ? this._factory.makeForUrl(ctx).denormalize(data.license.url, ctx, [...path, 'license', 'url'])
            : undefined
        })
      }
    } else {
      throw new Error('Invalid license')
    }
  }
}

export class SWIDDenormalizer extends BaseJsonDenormalizer<Models.SWID> {
  denormalize (data: Record<string, any>, ctx: JSONDenormalizerContext, path: PathType): Models.SWID {
    assertNonEmptyStr(data.tagId, [...path, 'tagId'])
    assertNonEmptyStr(data.name, [...path, 'name'])
    return new Models.SWID(data.tagId, data.name, {
      patch: warnBoolOrUndef(data.patch, ctx, [...path, 'patch']),
      version: warnStringOrUndef(data.version, ctx, [...path, 'version']),
      tagVersion: warnNumberOrUndef(data.tagVersion, ctx, [...path, 'tagVersion']),
      text: (data.text != null)
        ? this._factory.makeForAttachment(ctx).denormalize(data.text, ctx, [...path, 'text'])
        : undefined,
      url: typeof data.url === 'string'
        ? this._factory.makeForUrl(ctx).denormalize(data.url, ctx, [...path, 'url'])
        : undefined
    })
  }
}

export class ExternalReferenceDenormalizer extends BaseJsonDenormalizer<Models.ExternalReference> {
  denormalize (data: Record<string, any>, ctx: JSONDenormalizerContext, path: PathType): Models.ExternalReference {
    assertEnum(data.type, Object.values(ExternalReferenceType), [...path, 'type'])
    return new Models.ExternalReference(this._factory.makeForUrl(ctx).denormalize(data.url, ctx, [...path, 'url']), data.type, {
      comment: warnStringOrUndef(data.comment, ctx, [...path, 'comment'])
    })
  }
}

export class AttachmentDenormalizer extends BaseJsonDenormalizer<Models.Attachment> {
  denormalize (data: Record<string, any>, ctx: JSONDenormalizerContext, path: PathType): Models.Attachment {
    assertNonEmptyStr(data.content, [...path, 'content'])
    return new Models.Attachment(data.content, {
      contentType: warnStringOrUndef(data.contentType, ctx, [...path, 'contentType']),
      encoding: warnEnumOrUndef(data.encoding, Object.values(AttachmentEncoding), ctx, [...path, 'encoding'])
    })
  }
}

export class PropertyDenormalizer extends BaseJsonDenormalizer<Models.Property> {
  denormalize (data: Record<string, any>, ctx: JSONDenormalizerContext, path: PathType): Models.Property {
    assertNonEmptyStr(data.name, [...path, 'name'])
    assertString(data.value, [...path, 'value'])
    return new Models.Property(data.name, data.value)
  }
}

export class UrlDenormalizer extends BaseJsonDenormalizer<URL | string> {
  denormalize (url: any, ctx: JSONDenormalizerContext, path: PathType): URL | string {
    assertNonEmptyStr(url, path)
    try {
      return new URL(url)
    } catch (e) {
      return url
    }
  }
}

export class BomRefDenormalizer extends BaseJsonDenormalizer<Models.BomRef> {
  denormalize (data: any, ctx: JSONDenormalizerContext, path: PathType): Models.BomRef {
    assertNonEmptyStr(data, path)
    return new Models.BomRef(data)
  }
}
