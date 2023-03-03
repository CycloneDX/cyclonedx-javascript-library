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

import { AttachmentEncoding, ComponentScope, ComponentType, ExternalReferenceType, HashAlgorithm } from '../../enums'
import * as Models from '../../models'
import type { Protocol, Protocol as Spec } from '../../spec'
import { Format, SpecVersionDict, UnsupportedFormatError } from '../../spec'
import type { JSONDenormalizerOptions, JSONDenormalizerWarning, PathType } from '../types'

interface JSONDenormalizerContext {
  options: JSONDenormalizerOptions
  spec: Spec
  allComps: Map<Models.BomRef, Models.Component>
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
      throw new TypeError(`${formatPath(warning.path)} is ${typeof warning.value} but should be one of [${warning.expected.join(', ')}]`)
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

function warnStringOrUndef (value: unknown, ctx: JSONDenormalizerContext, path: PathType): string | undefined {
  if (value !== undefined && typeof value !== 'string') {
    callWarnFunc(ctx, {
      type: 'type',
      actual: typeof value,
      expected: ['string', 'undefined'],
      path,
      value
    })
    return undefined
  }
  return value
}

function warnBoolOrUndef (value: unknown, ctx: JSONDenormalizerContext, path: PathType): boolean | undefined {
  if (value !== undefined && typeof value !== 'boolean') {
    callWarnFunc(ctx, {
      type: 'type',
      actual: typeof value,
      expected: ['boolean', 'undefined'],
      path,
      value
    })
    return undefined
  }
  return value
}

function warnRecordOrUndef (value: unknown, ctx: JSONDenormalizerContext, path: PathType): Record<string, unknown> | undefined {
  if (value !== undefined && (typeof value !== 'object')) {
    callWarnFunc(ctx, {
      type: 'type',
      actual: typeof value,
      expected: ['_record', 'undefined'],
      path,
      value
    })
    return undefined
  }
  return value as Record<string, unknown>
}

function warnEnumOrUndef<KT> (value: unknown, allowed: KT[], ctx: JSONDenormalizerContext, path: PathType): KT | undefined {
  if (value !== undefined && !allowed.includes(value as any)) {
    callWarnFunc(ctx, {
      type: 'value',
      path,
      value,
      message: `should be one of ${JSON.stringify(allowed)}`
    })
    return undefined
  }
  return value as KT
}

function warnNumberOrUndef (value: unknown, ctx: JSONDenormalizerContext, path: PathType): number | undefined {
  if (value !== undefined && typeof value !== 'number') {
    callWarnFunc(ctx, {
      type: 'type',
      actual: typeof value,
      expected: ['number', 'undefined'],
      path,
      value
    })
    return undefined
  }
  return value
}

function warnArrayOrUndef (value: unknown, ctx: JSONDenormalizerContext, path: PathType): unknown[] | undefined {
  if (value !== undefined && !Array.isArray(value)) {
    callWarnFunc(ctx, {
      type: 'type',
      actual: typeof value,
      expected: ['_array', 'undefined'],
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
  denormalizer: BaseJsonDenormalizer<VT, unknown>,
  Repository: new(arr: VT[]) => RT
): RT | undefined {
  const arr2 = warnArrayOrUndef(arr, ctx, path)
  return (arr2 !== undefined)
    ? new Repository(arr2.map((item: unknown, index: number) => denormalizer.denormalize(item, ctx, [...path, index])))
    : undefined
}

function denormalizeRecord<T> (
  record: unknown,
  ctx: JSONDenormalizerContext,
  path: PathType,
  denormalizer: BaseJsonDenormalizer<T>
): T | undefined {
  const v = warnRecordOrUndef(record, ctx, path)
  return v !== undefined ? denormalizer.denormalize(v, ctx, path) : undefined
}

export class Factory {
  makeForBom (ctx: { options: JSONDenormalizerOptions }): BomDenormalizer {
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

abstract class BaseJsonDenormalizer<TModel, TNormalized = Record<string, unknown>> implements JsonDenormalizer<TModel, TNormalized> {
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
  denormalize (data: Record<string, unknown>, { options }: { options: JSONDenormalizerOptions }, path: PathType): Models.Bom {
    assertEnum(data.bomFormat, ['CycloneDX'], [...path, 'bomFormat'])
    assertEnum(data.specVersion, Object.keys(SpecVersionDict), [...path, 'specVersion'])
    const spec = SpecVersionDict[data.specVersion as keyof typeof SpecVersionDict] as Protocol
    if (!spec.supportsFormat(Format.JSON)) {
      throw new UnsupportedFormatError(`Spec version ${spec.version} is not supported for JSON format.`)
    }
    const ctx: JSONDenormalizerContext = {
      spec,
      options,
      allComps: new Map()
    }
    const bom = new Models.Bom({
      components: createRepository(data.components, ctx, [...path, 'components'], this._factory.makeForComponent(ctx), Models.ComponentRepository),
      metadata: denormalizeRecord(data.metadata, ctx, [...path, 'metadata'], this._factory.makeForMetadata(ctx)),
      serialNumber: warnStringOrUndef(data.serialNumber, ctx, [...path, 'serialNumber']),
      version: warnNumberOrUndef(data.version, ctx, [...path, 'version'])
      // TODO
      // vulnerabilities: (Array.isArray(data.vulnerabilities)) ? new Models.Vulnerability.VulnerabilityRepository(data.vulnerabilities.map(v => this._factory.makeForVulnerability()(v, options)))
    })

    const allComps = ctx.allComps
    const deps = warnArrayOrUndef(data.dependencies, ctx, [...path, 'dependencies'])
    const dependencyList = new Map<Models.BomRef, Models.BomRef[]>()
    if (deps !== undefined) {
      deps.forEach(({ ref, dependsOn }: any, a: number) => {
        const refstr = warnStringOrUndef(ref, ctx, [...path, 'dependencies', a, 'ref'])
        if (refstr !== undefined) {
          let bomRef = Array.from(allComps.keys()).find(ebr => ebr.toString() === refstr)
          if (bomRef === undefined) {
            bomRef = new Models.BomRef(refstr)
          }
          const arr = warnArrayOrUndef(dependsOn, ctx, [...path, 'dependencies', a, 'dependsOn'])
          if (arr !== undefined) {
            const deps: Models.BomRef[] = []
            arr.forEach((dep: unknown, b: number) => {
              const depstr = warnStringOrUndef(dep, ctx, [...path, 'dependencies', a, 'dependsOn'])
              if (depstr !== undefined) {
                let bomRef = Array.from(allComps.keys()).find(ebr => ebr.toString() === depstr)
                if (bomRef === undefined) {
                  bomRef = new Models.BomRef(depstr)
                }
                deps.push(bomRef)
              }
            })
            dependencyList.set(bomRef, deps)
          }
        }
      })
    }
    for (const [, comp] of allComps) {
      const deps = dependencyList.get(comp.bomRef) ?? []
      for (const dep of deps) {
        comp.dependencies.add(dep)
      }
    }
    return bom
  }
}

export class MetadataDenormalizer extends BaseJsonDenormalizer<Models.Metadata> {
  denormalize (data: Record<string, unknown>, ctx: JSONDenormalizerContext, path: PathType): Models.Metadata {
    const doe = this._factory.makeForOrganizationalEntity(ctx)
    const ts = warnStringOrUndef(data.timestamp, ctx, [...path, 'timestamp'])
    return new Models.Metadata({
      authors: createRepository(data.authors, ctx, [...path, 'authors'], this._factory.makeForOrganizationalContact(ctx), Models.OrganizationalContactRepository),
      component: denormalizeRecord(data.component, ctx, [...path, 'component'], this._factory.makeForComponent(ctx)),
      manufacture: denormalizeRecord(data.manufacture, ctx, [...path, 'manufacture'], doe),
      supplier: denormalizeRecord(data.supplier, ctx, [...path, 'supplier'], doe),
      timestamp: ts !== undefined ? new Date(ts) : undefined,
      tools: createRepository(data.tools, ctx, [...path, 'tools'], this._factory.makeForTool(ctx), Models.ToolRepository)
    })
  }
}

export class ComponentDenormalizer extends BaseJsonDenormalizer<Models.Component> {
  denormalize (data: Record<string, unknown>, ctx: JSONDenormalizerContext, path: PathType): Models.Component {
    assertEnum(data.type, Object.values(ComponentType), [...path, 'type'])
    assertNonEmptyStr(data.name, [...path, 'name'])
    const erdn = this._factory.makeForExternalReference(ctx)
    const ldn = this._factory.makeForLicense(ctx)
    const pdn = this._factory.makeForProperty(ctx)
    const comp = new Models.Component(data.type, data.name, {
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
      supplier: denormalizeRecord(data.supplier, ctx, [...path, 'supplier'], this._factory.makeForOrganizationalEntity(ctx)),
      swid: denormalizeRecord(data.swid, ctx, [...path, 'swid'], this._factory.makeForSWID(ctx)),
      version: warnStringOrUndef(data.version, ctx, [...path, 'version'])
    })
    ctx.allComps.set(comp.bomRef, comp)
    return comp
  }
}

export class ToolDenormalizer extends BaseJsonDenormalizer<Models.Tool> {
  denormalize (data: Record<string, unknown>, ctx: JSONDenormalizerContext, path: PathType): Models.Tool {
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
  denormalize (data: Record<string, unknown>, ctx: JSONDenormalizerContext, path: PathType): Models.OrganizationalContact {
    return new Models.OrganizationalContact({
      name: warnStringOrUndef(data.name, ctx, [...path, 'name']),
      email: warnStringOrUndef(data.email, ctx, [...path, 'email']),
      phone: warnStringOrUndef(data.phone, ctx, [...path, 'phone'])
    })
  }
}

export class OrganizationalEntityDenormalizer extends BaseJsonDenormalizer<Models.OrganizationalEntity> {
  denormalize (data: Record<string, unknown>, ctx: JSONDenormalizerContext, path: PathType): Models.OrganizationalEntity {
    return new Models.OrganizationalEntity({
      name: warnStringOrUndef(data.name, ctx, [...path, 'name']),
      url: createRepository<URL | string, Set<URL | string>>(data.url, ctx, [...path, 'url'], this._factory.makeForUrl(ctx), Set),
      contact: createRepository(data.contact, ctx, [...path, 'contact'], this._factory.makeForOrganizationalContact(ctx), Models.OrganizationalContactRepository)
    })
  }
}

export class HashDenormalizer extends BaseJsonDenormalizer<Models.Hash> {
  denormalize (data: Record<string, unknown>, ctx: JSONDenormalizerContext, path: PathType): Models.Hash {
    assertEnum(data.alg, Object.values(HashAlgorithm), [...path, 'algorithm'])
    assertNonEmptyStr(data.content, [...path, 'content'])
    return [data.alg, data.content]
  }
}

export class LicenseDenormalizer extends BaseJsonDenormalizer<Models.License> {
  denormalize (data: Record<string, unknown>, ctx: JSONDenormalizerContext, path: PathType): Models.License {
    const expr = warnStringOrUndef(data.expression, ctx, [...path, 'expression'])
    const lic = warnRecordOrUndef(data.license, ctx, [...path, 'license'])
    if (expr !== undefined) {
      return new Models.LicenseExpression(expr)
    } else if (lic !== undefined) {
      const urlstr = warnStringOrUndef(lic.url, ctx, [...path, 'license', 'url'])
      const url = (urlstr !== undefined)
        ? this._factory.makeForUrl(ctx).denormalize(urlstr, ctx, [...path, 'license', 'url'])
        : undefined
      const text = denormalizeRecord(lic.text, ctx, [...path, 'license', 'text'], this._factory.makeForAttachment(ctx))
      if (typeof lic.id === 'string') {
        assertNonEmptyStr(lic.id, [...path, 'license', 'id'])
        return new Models.SpdxLicense(lic.id, { text, url })
      } else {
        assertNonEmptyStr(lic.name, [...path, 'license', 'name'])
        return new Models.NamedLicense(lic.name, { text, url })
      }
    } else {
      throw new Error('Invalid license')
    }
  }
}

export class SWIDDenormalizer extends BaseJsonDenormalizer<Models.SWID> {
  denormalize (data: Record<string, unknown>, ctx: JSONDenormalizerContext, path: PathType): Models.SWID {
    assertNonEmptyStr(data.tagId, [...path, 'tagId'])
    assertNonEmptyStr(data.name, [...path, 'name'])
    const url = warnStringOrUndef(data.url, ctx, [...path, 'url'])
    return new Models.SWID(data.tagId, data.name, {
      patch: warnBoolOrUndef(data.patch, ctx, [...path, 'patch']),
      version: warnStringOrUndef(data.version, ctx, [...path, 'version']),
      tagVersion: warnNumberOrUndef(data.tagVersion, ctx, [...path, 'tagVersion']),
      text: denormalizeRecord(data.text, ctx, [...path, 'text'], this._factory.makeForAttachment(ctx)),
      url: url !== undefined
        ? this._factory.makeForUrl(ctx).denormalize(url, ctx, [...path, 'url'])
        : undefined
    })
  }
}

export class ExternalReferenceDenormalizer extends BaseJsonDenormalizer<Models.ExternalReference> {
  denormalize (data: Record<string, unknown>, ctx: JSONDenormalizerContext, path: PathType): Models.ExternalReference {
    assertEnum(data.type, Object.values(ExternalReferenceType), [...path, 'type'])
    return new Models.ExternalReference(this._factory.makeForUrl(ctx).denormalize(data.url, ctx, [...path, 'url']), data.type, {
      comment: warnStringOrUndef(data.comment, ctx, [...path, 'comment'])
    })
  }
}

export class AttachmentDenormalizer extends BaseJsonDenormalizer<Models.Attachment> {
  denormalize (data: Record<string, unknown>, ctx: JSONDenormalizerContext, path: PathType): Models.Attachment {
    assertNonEmptyStr(data.content, [...path, 'content'])
    return new Models.Attachment(data.content, {
      contentType: warnStringOrUndef(data.contentType, ctx, [...path, 'contentType']),
      encoding: warnEnumOrUndef(data.encoding, Object.values(AttachmentEncoding), ctx, [...path, 'encoding'])
    })
  }
}

export class PropertyDenormalizer extends BaseJsonDenormalizer<Models.Property> {
  denormalize (data: Record<string, unknown>, ctx: JSONDenormalizerContext, path: PathType): Models.Property {
    assertNonEmptyStr(data.name, [...path, 'name'])
    assertString(data.value, [...path, 'value'])
    return new Models.Property(data.name, data.value)
  }
}

export class UrlDenormalizer extends BaseJsonDenormalizer<URL | string> {
  denormalize (url: unknown, ctx: JSONDenormalizerContext, path: PathType): URL | string {
    assertNonEmptyStr(url, path)
    try {
      return new URL(url)
    } catch (e) {
      return url
    }
  }
}

export class BomRefDenormalizer extends BaseJsonDenormalizer<Models.BomRef> {
  denormalize (data: unknown, ctx: JSONDenormalizerContext, path: PathType): Models.BomRef {
    assertNonEmptyStr(data, path)
    return new Models.BomRef(data)
  }
}
