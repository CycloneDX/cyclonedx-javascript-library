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

import { isNotUndefined } from '../../_helpers/notUndefined'
import type { SortableIterable } from '../../_helpers/sortable'
import type { Stringable } from '../../_helpers/stringable'
import { treeIteratorSymbol } from '../../_helpers/tree'
import * as Models from '../../models'
import type { Protocol as Spec } from '../../spec'
import { Version as SpecVersion } from '../../spec'
import type { NormalizerOptions } from '../types'
import type { SimpleXml } from './types'
import { XmlSchema } from './types'

export class Factory {
  readonly #spec: Spec

  constructor (spec: Factory['spec']) {
    this.#spec = spec
  }

  get spec (): Spec {
    return this.#spec
  }

  makeForBom (): BomNormalizer {
    return new BomNormalizer(this)
  }

  makeForMetadata (): MetadataNormalizer {
    return new MetadataNormalizer(this)
  }

  makeForComponent (): ComponentNormalizer {
    return new ComponentNormalizer(this)
  }

  makeForTool (): ToolNormalizer {
    return new ToolNormalizer(this)
  }

  makeForOrganizationalContact (): OrganizationalContactNormalizer {
    return new OrganizationalContactNormalizer(this)
  }

  makeForOrganizationalEntity (): OrganizationalEntityNormalizer {
    return new OrganizationalEntityNormalizer(this)
  }

  makeForHash (): HashNormalizer {
    return new HashNormalizer(this)
  }

  makeForLicense (): LicenseNormalizer {
    return new LicenseNormalizer(this)
  }

  makeForSWID (): SWIDNormalizer {
    return new SWIDNormalizer(this)
  }

  makeForExternalReference (): ExternalReferenceNormalizer {
    return new ExternalReferenceNormalizer(this)
  }

  makeForAttachment (): AttachmentNormalizer {
    return new AttachmentNormalizer(this)
  }

  makeForProperty (): PropertyNormalizer {
    return new PropertyNormalizer(this)
  }

  makeForDependencyGraph (): DependencyGraphNormalizer {
    return new DependencyGraphNormalizer(this)
  }
}

const xmlNamespace: ReadonlyMap<SpecVersion, string> = new Map([
  [SpecVersion.v1dot2, 'http://cyclonedx.org/schema/bom/1.2'],
  [SpecVersion.v1dot3, 'http://cyclonedx.org/schema/bom/1.3'],
  [SpecVersion.v1dot4, 'http://cyclonedx.org/schema/bom/1.4']
])

interface XmlNormalizer<TModel, TNormalized> {
  normalize: (data: TModel, options: NormalizerOptions, elementName?: string) => TNormalized | undefined

  /** @since 1.5.1 */
  normalizeIterable?: (data: SortableIterable<TModel>, options: NormalizerOptions, elementName: string) => TNormalized[]
  /** @deprecated use {@link normalizeIterable} instead of {@link normalizeRepository} */
  normalizeRepository?: ['normalizeIterable']
}

abstract class BaseXmlNormalizer<TModel, TNormalized=SimpleXml.Element> implements XmlNormalizer<TModel, TNormalized> {
  protected readonly _factory: Factory

  constructor (factory: Factory) {
    this._factory = factory
  }

  get factory (): Factory {
    return this._factory
  }

  /**
   * @param elementName - element name. XML defines structures; the element's name is defined on usage of a structure.
   */
  abstract normalize (data: TModel, options: NormalizerOptions, elementName?: string): TNormalized | undefined
}

/* eslint-disable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions --
 * since empty strings need to be treated as undefined/null
 */

export class BomNormalizer extends BaseXmlNormalizer<Models.Bom> {
  normalize (data: Models.Bom, options: NormalizerOptions): SimpleXml.Element {
    const components: SimpleXml.Element = {
      // spec < 1.4 always requires a 'components' element
      type: 'element',
      name: 'components',
      children: data.components.size > 0
        ? this._factory.makeForComponent().normalizeIterable(data.components, options, 'component')
        : undefined
    }
    return {
      type: 'element',
      // the element's name is hardcoded in the XSD
      name: 'bom',
      namespace: xmlNamespace.get(this._factory.spec.version),
      attributes: {
        version: data.version,
        serialNumber: this.#isEligibleSerialNumber(data.serialNumber)
          ? data.serialNumber
          : undefined
      },
      children: [
        data.metadata
          ? this._factory.makeForMetadata().normalize(data.metadata, options, 'metadata')
          : undefined,
        components,
        this._factory.spec.supportsDependencyGraph
          ? this._factory.makeForDependencyGraph().normalize(data, options, 'dependencies')
          : undefined
      ].filter(isNotUndefined)
    }
  }

  #isEligibleSerialNumber (v: string | undefined): boolean {
    return v !== undefined &&
      // see https://github.com/CycloneDX/specification/blob/ef71717ae0ecb564c0b4c9536d6e9e57e35f2e69/schema/bom-1.4.xsd#L699
      /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$|^\{[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\}$/.test(v)
  }
}

export class MetadataNormalizer extends BaseXmlNormalizer<Models.Metadata> {
  normalize (data: Models.Metadata, options: NormalizerOptions, elementName: string): SimpleXml.Element {
    const orgEntityNormalizer = this._factory.makeForOrganizationalEntity()
    const timestamp: SimpleXml.Element | undefined = data.timestamp === undefined
      ? undefined
      : {
          type: 'element',
          name: 'timestamp',
          children: data.timestamp.toISOString()
        }
    const tools: SimpleXml.Element | undefined = data.tools.size > 0
      ? {
          type: 'element',
          name: 'tools',
          children: this._factory.makeForTool().normalizeIterable(data.tools, options, 'tool')
        }
      : undefined
    const authors: SimpleXml.Element | undefined = data.authors.size > 0
      ? {
          type: 'element',
          name: 'authors',
          children: this._factory.makeForOrganizationalContact()
            .normalizeIterable(data.authors, options, 'author')
        }
      : undefined
    return {
      type: 'element',
      name: elementName,
      children: [
        timestamp,
        tools,
        authors,
        data.component === undefined
          ? undefined
          : this._factory.makeForComponent().normalize(data.component, options, 'component'),
        data.manufacture === undefined
          ? undefined
          : orgEntityNormalizer.normalize(data.manufacture, options, 'manufacture'),
        data.supplier === undefined
          ? undefined
          : orgEntityNormalizer.normalize(data.supplier, options, 'supplier')
      ].filter(isNotUndefined)
    }
  }
}

export class ToolNormalizer extends BaseXmlNormalizer<Models.Tool> {
  normalize (data: Models.Tool, options: NormalizerOptions, elementName: string): SimpleXml.Element {
    const hashes: SimpleXml.Element | undefined = data.hashes.size > 0
      ? {
          type: 'element',
          name: 'hashes',
          children: this._factory.makeForHash().normalizeIterable(data.hashes, options, 'hash')
        }
      : undefined
    const externalReferences: SimpleXml.Element | undefined =
      this._factory.spec.supportsToolReferences && data.externalReferences.size > 0
        ? {
            type: 'element',
            name: 'externalReferences',
            children: this._factory.makeForExternalReference()
              .normalizeIterable(data.externalReferences, options, 'reference')
          }
        : undefined
    return {
      type: 'element',
      name: elementName,
      children: [
        makeOptionalTextElement(data.vendor, 'vendor'),
        makeOptionalTextElement(data.name, 'name'),
        makeOptionalTextElement(data.version, 'version'),
        hashes,
        externalReferences
      ].filter(isNotUndefined)
    }
  }

  /** @since 1.5.1 */
  normalizeIterable (data: SortableIterable<Models.Tool>, options: NormalizerOptions, elementName: string): SimpleXml.Element[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(t => this.normalize(t, options, elementName))
  }

  /** @deprecated use {@link normalizeIterable} instead of {@link normalizeRepository} */
  normalizeRepository = this.normalizeIterable
}

export class HashNormalizer extends BaseXmlNormalizer<Models.Hash> {
  normalize ([algorithm, content]: Models.Hash, options: NormalizerOptions, elementName: string): SimpleXml.Element | undefined {
    const spec = this._factory.spec
    return spec.supportsHashAlgorithm(algorithm) && spec.supportsHashValue(content)
      ? {
          type: 'element',
          name: elementName,
          attributes: { alg: algorithm },
          children: content
        }
      : undefined
  }

  /** @since 1.5.1 */
  normalizeIterable (data: SortableIterable<Models.Hash>, options: NormalizerOptions, elementName: string): SimpleXml.Element[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(
      h => this.normalize(h, options, elementName)
    ).filter(isNotUndefined)
  }

  /** @deprecated use {@link normalizeIterable} instead of {@link normalizeRepository} */
  normalizeRepository = this.normalizeIterable
}

export class OrganizationalContactNormalizer extends BaseXmlNormalizer<Models.OrganizationalContact> {
  normalize (data: Models.OrganizationalContact, options: NormalizerOptions, elementName: string): SimpleXml.Element {
    return {
      type: 'element',
      name: elementName,
      children: [
        makeOptionalTextElement(data.name, 'name'),
        makeOptionalTextElement(data.email, 'email'),
        makeOptionalTextElement(data.phone, 'phone')
      ].filter(isNotUndefined)
    }
  }

  /** @since 1.5.1 */
  normalizeIterable (data: SortableIterable<Models.OrganizationalContact>, options: NormalizerOptions, elementName: string): SimpleXml.Element[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(c => this.normalize(c, options, elementName))
  }

  /** @deprecated use {@link normalizeIterable} instead of {@link normalizeRepository} */
  normalizeRepository = this.normalizeIterable
}

export class OrganizationalEntityNormalizer extends BaseXmlNormalizer<Models.OrganizationalEntity> {
  normalize (data: Models.OrganizationalEntity, options: NormalizerOptions, elementName: string): SimpleXml.Element {
    return {
      type: 'element',
      name: elementName,
      children: [
        makeOptionalTextElement(data.name, 'name'),
        ...makeTextElementIter(data.url, options, 'url')
          .filter(({ children: u }) => XmlSchema.isAnyURI(u)),
        ...this._factory.makeForOrganizationalContact().normalizeIterable(data.contact, options, 'contact')
      ].filter(isNotUndefined)
    }
  }
}

export class ComponentNormalizer extends BaseXmlNormalizer<Models.Component> {
  normalize (data: Models.Component, options: NormalizerOptions, elementName: string): SimpleXml.Element | undefined {
    const spec = this._factory.spec
    if (!spec.supportsComponentType(data.type)) {
      return undefined
    }
    const supplier: SimpleXml.Element | undefined = data.supplier === undefined
      ? undefined
      : this._factory.makeForOrganizationalEntity().normalize(data.supplier, options, 'supplier')
    const version: SimpleXml.Element | undefined = (
      spec.requiresComponentVersion
        ? makeTextElement
        : makeOptionalTextElement
    )(
      data.version ?? '',
      'version'
    )
    const hashes: SimpleXml.Element | undefined = data.hashes.size > 0
      ? {
          type: 'element',
          name: 'hashes',
          children: this._factory.makeForHash().normalizeIterable(data.hashes, options, 'hash')
        }
      : undefined
    const licenses: SimpleXml.Element | undefined = data.licenses.size > 0
      ? {
          type: 'element',
          name: 'licenses',
          children: this._factory.makeForLicense().normalizeIterable(data.licenses, options)
        }
      : undefined
    const swid: SimpleXml.Element | undefined = data.swid === undefined
      ? undefined
      : this._factory.makeForSWID().normalize(data.swid, options, 'swid')
    const extRefs: SimpleXml.Element | undefined = data.externalReferences.size > 0
      ? {
          type: 'element',
          name: 'externalReferences',
          children: this._factory.makeForExternalReference()
            .normalizeIterable(data.externalReferences, options, 'reference')
        }
      : undefined
    const properties: SimpleXml.Element | undefined = spec.supportsProperties(data) && data.properties.size > 0
      ? {
          type: 'element',
          name: 'properties',
          children: this._factory.makeForProperty().normalizeIterable(data.properties, options, 'property')
        }
      : undefined
    const components: SimpleXml.Element | undefined = data.components.size > 0
      ? {
          type: 'element',
          name: 'components',
          children: this.normalizeIterable(data.components, options, 'component')
        }
      : undefined
    return {
      type: 'element',
      name: elementName,
      attributes: {
        type: data.type,
        'bom-ref': data.bomRef.value
      },
      children: [
        supplier,
        makeOptionalTextElement(data.author, 'author'),
        makeOptionalTextElement(data.publisher, 'publisher'),
        makeOptionalTextElement(data.group, 'group'),
        makeTextElement(data.name, 'name'),
        version,
        makeOptionalTextElement(data.description, 'description'),
        makeOptionalTextElement(data.scope, 'scope'),
        hashes,
        licenses,
        makeOptionalTextElement(data.copyright, 'copyright'),
        makeOptionalTextElement(data.cpe, 'cpe'),
        makeOptionalTextElement(data.purl, 'purl'),
        swid,
        extRefs,
        properties,
        components
      ].filter(isNotUndefined)
    }
  }

  /** @since 1.5.1 */
  normalizeIterable (data: SortableIterable<Models.Component>, options: NormalizerOptions, elementName: string): SimpleXml.Element[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(
      c => this.normalize(c, options, elementName)
    ).filter(isNotUndefined)
  }

  /** @deprecated use {@link normalizeIterable} instead of {@link normalizeRepository} */
  normalizeRepository = this.normalizeIterable
}

export class LicenseNormalizer extends BaseXmlNormalizer<Models.License> {
  normalize (data: Models.License, options: NormalizerOptions): SimpleXml.Element {
    switch (true) {
      case data instanceof Models.NamedLicense:
        return this.#normalizeNamedLicense(data as Models.NamedLicense, options)
      case data instanceof Models.SpdxLicense:
        return this.#normalizeSpdxLicense(data as Models.SpdxLicense, options)
      case data instanceof Models.LicenseExpression:
        return this.#normalizeLicenseExpression(data as Models.LicenseExpression)
      /* c8 ignore start */
      default:
        // this case is not expected to happen - and therefore is undocumented
        throw new TypeError('Unexpected LicenseChoice')
      /* c8 ignore end */
    }
  }

  #normalizeNamedLicense (data: Models.NamedLicense, options: NormalizerOptions): SimpleXml.Element {
    const url = data.url?.toString()
    return {
      type: 'element',
      name: 'license',
      children: [
        makeTextElement(data.name, 'name'),
        data.text === undefined
          ? undefined
          : this._factory.makeForAttachment().normalize(data.text, options, 'text'),
        XmlSchema.isAnyURI(url)
          ? makeTextElement(url, 'url')
          : undefined
      ].filter(isNotUndefined)
    }
  }

  #normalizeSpdxLicense (data: Models.SpdxLicense, options: NormalizerOptions): SimpleXml.Element {
    const url = data.url?.toString()
    return {
      type: 'element',
      name: 'license',
      children: [
        makeTextElement(data.id, 'id'),
        data.text === undefined
          ? undefined
          : this._factory.makeForAttachment().normalize(data.text, options, 'text'),
        XmlSchema.isAnyURI(url)
          ? makeTextElement(url, 'url')
          : undefined
      ].filter(isNotUndefined)
    }
  }

  #normalizeLicenseExpression (data: Models.LicenseExpression): SimpleXml.Element {
    return makeTextElement(data.expression, 'expression')
  }

  /**
   * If there is any {@link Models.LicenseExpression | LicenseExpression} in the set, then this is the only item that is normalized.
   *
   * @since 1.5.1
   */
  normalizeIterable (data: SortableIterable<Models.License>, options: NormalizerOptions): SimpleXml.Element[] {
    const licenses = options.sortLists ?? false
      ? data.sorted()
      : Array.from(data)

    if (licenses.length > 1) {
      const expressions = licenses.filter(l => l instanceof Models.LicenseExpression) as Models.LicenseExpression[]
      if (expressions.length > 0) {
        // could have thrown {@link RangeError} when there is more than one only {@link Models.LicenseExpression | LicenseExpression}.
        // but let's be graceful and just normalize to the most relevant choice: any expression
        return [this.#normalizeLicenseExpression(expressions[0])]
      }
    }

    return licenses.map(l => this.normalize(l, options))
  }

  /** @deprecated use {@link normalizeIterable} instead of {@link normalizeRepository} */
  normalizeRepository = this.normalizeIterable
}

export class SWIDNormalizer extends BaseXmlNormalizer<Models.SWID> {
  normalize (data: Models.SWID, options: NormalizerOptions, elementName: string): SimpleXml.Element {
    const url = data.url?.toString()
    return {
      type: 'element',
      name: elementName,
      attributes: {
        tagId: data.tagId,
        name: data.name,
        version: data.version || undefined,
        tagVersion: data.tagVersion,
        patch: data.patch === undefined
          ? undefined
          : (data.patch ? 'true' : 'false')
      },
      children: [
        data.text === undefined
          ? undefined
          : this._factory.makeForAttachment().normalize(data.text, options, 'text'),
        XmlSchema.isAnyURI(url)
          ? makeTextElement(url, 'url')
          : undefined
      ].filter(isNotUndefined)
    }
  }
}

export class ExternalReferenceNormalizer extends BaseXmlNormalizer<Models.ExternalReference> {
  normalize (data: Models.ExternalReference, options: NormalizerOptions, elementName: string): SimpleXml.Element | undefined {
    const url = data.url.toString()
    return this._factory.spec.supportsExternalReferenceType(data.type) &&
    XmlSchema.isAnyURI(url)
      ? {
          type: 'element',
          name: elementName,
          attributes: {
            type: data.type
          },
          children: [
            makeTextElement(url, 'url'),
            makeOptionalTextElement(data.comment, 'comment')
          ].filter(isNotUndefined)
        }
      : undefined
  }

  /** @since 1.5.1 */
  normalizeIterable (data: SortableIterable<Models.ExternalReference>, options: NormalizerOptions, elementName: string): SimpleXml.Element[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(
      r => this.normalize(r, options, elementName)
    ).filter(isNotUndefined)
  }

  /** @deprecated use {@link normalizeIterable} instead of {@link normalizeRepository} */
  normalizeRepository = this.normalizeIterable
}

export class AttachmentNormalizer extends BaseXmlNormalizer<Models.Attachment> {
  normalize (data: Models.Attachment, options: NormalizerOptions, elementName: string): SimpleXml.Element {
    return {
      type: 'element',
      name: elementName,
      attributes: {
        'content-type': data.contentType || undefined,
        encoding: data.encoding || undefined
      },
      children: data.content
    }
  }
}

export class PropertyNormalizer extends BaseXmlNormalizer<Models.Property> {
  normalize (data: Models.Property, options: NormalizerOptions, elementName: string): SimpleXml.Element {
    return {
      type: 'element',
      name: elementName,
      attributes: {
        name: data.name
      },
      children: data.value
    }
  }

  /** @since 1.5.1 */
  normalizeIterable (data: SortableIterable<Models.Property>, options: NormalizerOptions, elementName: string): SimpleXml.Element[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(p => this.normalize(p, options, elementName))
  }

  /** @deprecated use {@link normalizeIterable} instead of {@link normalizeRepository} */
  normalizeRepository = this.normalizeIterable
}

export class DependencyGraphNormalizer extends BaseXmlNormalizer<Models.Bom> {
  normalize (data: Models.Bom, options: NormalizerOptions, elementName: string): SimpleXml.Element | undefined {
    const allRefs = new Map<Models.BomRef, Models.BomRefRepository>()
    if (data.metadata.component !== undefined) {
      allRefs.set(data.metadata.component.bomRef, data.metadata.component.dependencies)
      for (const component of data.metadata.component.components[treeIteratorSymbol]()) {
        allRefs.set(component.bomRef, component.dependencies)
      }
    }
    for (const component of data.components[treeIteratorSymbol]()) {
      allRefs.set(component.bomRef, component.dependencies)
    }

    const normalized: Array<(SimpleXml.Element & { attributes: { ref: string } })> = []
    for (const [ref, deps] of allRefs) {
      const dep = this.#normalizeDependency(ref, deps, allRefs, options)
      if (isNotUndefined(dep)) {
        normalized.push(dep)
      }
    }

    if (options.sortLists ?? false) {
      normalized.sort(
        ({ attributes: { ref: a } }, { attributes: { ref: b } }) => a.localeCompare(b))
    }

    return {
      type: 'element',
      name: elementName,
      children: normalized
    }
  }

  #normalizeDependency (
    ref: Models.BomRef,
    deps: Models.BomRefRepository,
    allRefs: Map<Models.BomRef, Models.BomRefRepository>,
    options: NormalizerOptions
  ): undefined | (SimpleXml.Element & { attributes: { ref: string } }) {
    const bomRef = ref.toString()
    if (bomRef.length === 0) {
      // no value -> cannot render
      return undefined
    }

    const dependsOn: string[] = Array.from(deps).filter(d => allRefs.has(d) && d !== ref)
      .map(d => d.toString()).filter(d => d.length > 0)
    if (options.sortLists ?? false) {
      dependsOn.sort((a, b) => a.localeCompare(b))
    }

    return {
      type: 'element',
      name: 'dependency',
      attributes: { ref: bomRef },
      children: dependsOn.map(d => ({
        type: 'element',
        name: 'dependency',
        attributes: { ref: d }
      }))
    }
  }
}

/* eslint-enable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions */

type StrictTextElement = SimpleXml.TextElement & { children: string }

function makeOptionalTextElement (data: null | undefined | Stringable, elementName: string): undefined | StrictTextElement {
  const s = data?.toString() ?? ''
  return s.length > 0
    ? makeTextElement(s, elementName)
    : undefined
}

function makeTextElement (data: Stringable, elementName: string): StrictTextElement {
  return {
    type: 'element',
    name: elementName,
    children: data.toString()
  }
}

function makeTextElementIter (data: Iterable<Stringable>, options: NormalizerOptions, elementName: string): StrictTextElement[] {
  const r: StrictTextElement[] = Array.from(data, d => makeTextElement(d, elementName))
  if (options.sortLists ?? false) {
    r.sort(({ children: a }, { children: b }) => a.localeCompare(b))
  }
  return r
}
