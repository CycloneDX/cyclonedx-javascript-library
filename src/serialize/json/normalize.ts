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
import type { Normalized } from './types'
import { JsonSchema } from './types'

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

  makeForVulnerability (): VulnerabilityNormalizer {
    return new VulnerabilityNormalizer(this)
  }

  makeForVulnerabilitySource (): VulnerabilitySourceNormalizer {
    return new VulnerabilitySourceNormalizer(this)
  }

  makeForVulnerabilityReference (): VulnerabilityReferenceNormalizer {
    return new VulnerabilityReferenceNormalizer(this)
  }
}

const schemaUrl: ReadonlyMap<SpecVersion, string> = new Map([
  [SpecVersion.v1dot2, 'http://cyclonedx.org/schema/bom-1.2b.schema.json'],
  [SpecVersion.v1dot3, 'http://cyclonedx.org/schema/bom-1.3a.schema.json'],
  [SpecVersion.v1dot4, 'http://cyclonedx.org/schema/bom-1.4.schema.json']
])

interface JsonNormalizer<TModel, TNormalized> {
  normalize: (data: TModel, options: NormalizerOptions) => TNormalized | undefined

  /** @since 1.5.1 */
  normalizeIterable?: (data: SortableIterable<TModel>, options: NormalizerOptions) => TNormalized[]
  /** @deprecated use {@link normalizeIterable} instead of {@link normalizeRepository} */
  normalizeRepository?: ['normalizeIterable']
}

abstract class BaseJsonNormalizer<TModel, TNormalized=object> implements JsonNormalizer<TModel, TNormalized> {
  protected readonly _factory: Factory

  constructor (factory: Factory) {
    this._factory = factory
  }

  get factory (): Factory {
    return this._factory
  }

  abstract normalize (data: TModel, options: NormalizerOptions): TNormalized | undefined
}

/* eslint-disable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions --
 * since empty strings need to be treated as undefined/null
 */

export class BomNormalizer extends BaseJsonNormalizer<Models.Bom> {
  normalize (data: Models.Bom, options: NormalizerOptions): Normalized.Bom {
    return {
      $schema: schemaUrl.get(this._factory.spec.version),
      bomFormat: 'CycloneDX',
      specVersion: this._factory.spec.version,
      version: data.version,
      serialNumber: data.serialNumber,
      metadata: this._factory.makeForMetadata().normalize(data.metadata, options),
      components: data.components.size > 0
        ? this._factory.makeForComponent().normalizeIterable(data.components, options)
        // spec < 1.4 requires `component` to be array
        : [],
      dependencies: this._factory.spec.supportsDependencyGraph
        ? this._factory.makeForDependencyGraph().normalize(data, options)
        : undefined,
      vulnerabilities: this._factory.spec.supportsVulnerabilities && data.vulnerabilities.size > 0
        ? this._factory.makeForVulnerability().normalizeIterable(data.vulnerabilities, options)
        : undefined
    }
  }
}

export class MetadataNormalizer extends BaseJsonNormalizer<Models.Metadata> {
  normalize (data: Models.Metadata, options: NormalizerOptions): Normalized.Metadata {
    const orgEntityNormalizer = this._factory.makeForOrganizationalEntity()
    return {
      timestamp: data.timestamp?.toISOString(),
      tools: data.tools.size > 0
        ? this._factory.makeForTool().normalizeIterable(data.tools, options)
        : undefined,
      authors: data.authors.size > 0
        ? this._factory.makeForOrganizationalContact().normalizeIterable(data.authors, options)
        : undefined,
      component: data.component === undefined
        ? undefined
        : this._factory.makeForComponent().normalize(data.component, options),
      manufacture: data.manufacture === undefined
        ? undefined
        : orgEntityNormalizer.normalize(data.manufacture, options),
      supplier: data.supplier === undefined
        ? undefined
        : orgEntityNormalizer.normalize(data.supplier, options)
    }
  }
}

export class ToolNormalizer extends BaseJsonNormalizer<Models.Tool> {
  normalize (data: Models.Tool, options: NormalizerOptions): Normalized.Tool {
    return {
      vendor: data.vendor || undefined,
      name: data.name || undefined,
      version: data.version || undefined,
      hashes: data.hashes.size > 0
        ? this._factory.makeForHash().normalizeIterable(data.hashes, options)
        : undefined,
      externalReferences: this._factory.spec.supportsToolReferences && data.externalReferences.size > 0
        ? this._factory.makeForExternalReference().normalizeIterable(data.externalReferences, options)
        : undefined
    }
  }

  /** @since 1.5.1 */
  normalizeIterable (data: SortableIterable<Models.Tool>, options: NormalizerOptions): Normalized.Tool[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(t => this.normalize(t, options))
  }

  /** @deprecated use {@link normalizeIterable} instead of {@link normalizeRepository} */
  normalizeRepository = this.normalizeIterable
}

export class HashNormalizer extends BaseJsonNormalizer<Models.Hash> {
  normalize ([algorithm, content]: Models.Hash, options: NormalizerOptions): Normalized.Hash | undefined {
    const spec = this._factory.spec
    return spec.supportsHashAlgorithm(algorithm) && spec.supportsHashValue(content)
      ? {
          alg: algorithm,
          content
        }
      : undefined
  }

  /** @since 1.5.1 */
  normalizeIterable (data: SortableIterable<Models.Hash>, options: NormalizerOptions): Normalized.Hash[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(
      h => this.normalize(h, options)
    ).filter(isNotUndefined)
  }

  /** @deprecated use {@link normalizeIterable} instead of {@link normalizeRepository} */
  normalizeRepository = this.normalizeIterable
}

export class OrganizationalContactNormalizer extends BaseJsonNormalizer<Models.OrganizationalContact> {
  normalize (data: Models.OrganizationalContact, options: NormalizerOptions): Normalized.OrganizationalContact {
    return {
      name: data.name || undefined,
      email: JsonSchema.isIdnEmail(data.email)
        ? data.email
        : undefined,
      phone: data.phone || undefined
    }
  }

  /** @since 1.5.1 */
  normalizeIterable (data: SortableIterable<Models.OrganizationalContact>, options: NormalizerOptions): Normalized.OrganizationalContact[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(c => this.normalize(c, options))
  }

  /** @deprecated use {@link normalizeIterable} instead of {@link normalizeRepository} */
  normalizeRepository = this.normalizeIterable
}

export class OrganizationalEntityNormalizer extends BaseJsonNormalizer<Models.OrganizationalEntity> {
  normalize (data: Models.OrganizationalEntity, options: NormalizerOptions): Normalized.OrganizationalEntity {
    const urls = normalizeStringableIter(data.url, options)
      .filter(JsonSchema.isIriReference)
    return {
      name: data.name || undefined,
      url: urls.length > 0
        ? urls
        : undefined,
      contact: data.contact.size > 0
        ? this._factory.makeForOrganizationalContact().normalizeIterable(data.contact, options)
        : undefined
    }
  }
}

export class ComponentNormalizer extends BaseJsonNormalizer<Models.Component> {
  normalize (data: Models.Component, options: NormalizerOptions): Normalized.Component | undefined {
    const spec = this._factory.spec
    const version: string = data.version ?? ''
    return spec.supportsComponentType(data.type)
      ? {
          type: data.type,
          name: data.name,
          group: data.group || undefined,
          version: version.length > 0 || spec.requiresComponentVersion
            ? version
            : undefined,
          'bom-ref': data.bomRef.value || undefined,
          supplier: data.supplier === undefined
            ? undefined
            : this._factory.makeForOrganizationalEntity().normalize(data.supplier, options),
          author: data.author || undefined,
          publisher: data.publisher || undefined,
          description: data.description || undefined,
          scope: data.scope,
          hashes: data.hashes.size > 0
            ? this._factory.makeForHash().normalizeIterable(data.hashes, options)
            : undefined,
          licenses: data.licenses.size > 0
            ? this._factory.makeForLicense().normalizeIterable(data.licenses, options)
            : undefined,
          copyright: data.copyright || undefined,
          cpe: data.cpe || undefined,
          purl: data.purl?.toString(),
          swid: data.swid === undefined
            ? undefined
            : this._factory.makeForSWID().normalize(data.swid, options),
          externalReferences: data.externalReferences.size > 0
            ? this._factory.makeForExternalReference().normalizeIterable(data.externalReferences, options)
            : undefined,
          properties: spec.supportsProperties(data) && data.properties.size > 0
            ? this._factory.makeForProperty().normalizeIterable(data.properties, options)
            : undefined,
          components: data.components.size > 0
            ? this.normalizeIterable(data.components, options)
            : undefined
        }
      : undefined
  }

  /** @since 1.5.1 */
  normalizeIterable (data: SortableIterable<Models.Component>, options: NormalizerOptions): Normalized.Component[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(
      c => this.normalize(c, options)
    ).filter(isNotUndefined)
  }

  /** @deprecated use {@link normalizeIterable} instead of {@link normalizeRepository} */
  normalizeRepository = this.normalizeIterable
}

export class LicenseNormalizer extends BaseJsonNormalizer<Models.License> {
  normalize (data: Models.License, options: NormalizerOptions): Normalized.License {
    switch (true) {
      case data instanceof Models.NamedLicense:
        return this.#normalizeNamedLicense(data as Models.NamedLicense, options)
      case data instanceof Models.SpdxLicense:
        return this.#normalizeSpdxLicense(data as Models.SpdxLicense, options)
      case data instanceof Models.LicenseExpression:
        return this.#normalizeLicenseExpression(data as Models.LicenseExpression)
      default:
        // this case is not expected to happen - and therefore is undocumented
        throw new TypeError('Unexpected LicenseChoice')
    }
  }

  #normalizeNamedLicense (data: Models.NamedLicense, options: NormalizerOptions): Normalized.NamedLicense {
    return {
      license: {
        name: data.name,
        text: data.text === undefined
          ? undefined
          : this._factory.makeForAttachment().normalize(data.text, options),
        url: data.url?.toString()
      }
    }
  }

  #normalizeSpdxLicense (data: Models.SpdxLicense, options: NormalizerOptions): Normalized.SpdxLicense {
    return {
      license: {
        id: data.id,
        text: data.text === undefined
          ? undefined
          : this._factory.makeForAttachment().normalize(data.text, options),
        url: data.url?.toString()
      }
    }
  }

  #normalizeLicenseExpression (data: Models.LicenseExpression): Normalized.LicenseExpression {
    return {
      expression: data.expression
    }
  }

  /** @since 1.5.1 */
  normalizeIterable (data: SortableIterable<Models.License>, options: NormalizerOptions): Normalized.License[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(c => this.normalize(c, options))
  }

  /** @deprecated use {@link normalizeIterable} instead of {@link normalizeRepository} */
  normalizeRepository = this.normalizeIterable
}

export class SWIDNormalizer extends BaseJsonNormalizer<Models.SWID> {
  normalize (data: Models.SWID, options: NormalizerOptions): Normalized.SWID {
    const url = data.url?.toString()
    return {
      tagId: data.tagId,
      name: data.name,
      version: data.version || undefined,
      tagVersion: data.tagVersion,
      patch: data.patch,
      text: data.text === undefined
        ? undefined
        : this._factory.makeForAttachment().normalize(data.text, options),
      url: JsonSchema.isIriReference(url)
        ? url
        : undefined
    }
  }
}

export class ExternalReferenceNormalizer extends BaseJsonNormalizer<Models.ExternalReference> {
  normalize (data: Models.ExternalReference, options: NormalizerOptions): Normalized.ExternalReference | undefined {
    return this._factory.spec.supportsExternalReferenceType(data.type)
      ? {
          url: data.url.toString(),
          type: data.type,
          comment: data.comment || undefined
        }
      : undefined
  }

  /** @since 1.5.1 */
  normalizeIterable (data: SortableIterable<Models.ExternalReference>, options: NormalizerOptions): Normalized.ExternalReference[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(
      r => this.normalize(r, options)
    ).filter(isNotUndefined)
  }

  /** @deprecated use {@link normalizeIterable} instead of {@link normalizeRepository} */
  normalizeRepository = this.normalizeIterable
}

export class AttachmentNormalizer extends BaseJsonNormalizer<Models.Attachment> {
  normalize (data: Models.Attachment, options: NormalizerOptions): Normalized.Attachment {
    return {
      content: data.content,
      contentType: data.contentType || undefined,
      encoding: data.encoding
    }
  }
}

export class PropertyNormalizer extends BaseJsonNormalizer<Models.Property> {
  normalize (data: Models.Property, options: NormalizerOptions): Normalized.Property {
    return {
      name: data.name,
      value: data.value
    }
  }

  /** @since 1.5.1 */
  normalizeIterable (data: SortableIterable<Models.Property>, options: NormalizerOptions): Normalized.Property[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(p => this.normalize(p, options))
  }

  /** @deprecated use {@link normalizeIterable} instead of {@link normalizeRepository} */
  normalizeRepository = this.normalizeIterable
}

export class DependencyGraphNormalizer extends BaseJsonNormalizer<Models.Bom> {
  normalize (data: Models.Bom, options: NormalizerOptions): Normalized.Dependency[] | undefined {
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

    const normalized: Normalized.Dependency[] = []
    for (const [ref, deps] of allRefs) {
      const dep = this.#normalizeDependency(ref, deps, allRefs, options)
      if (isNotUndefined(dep)) {
        normalized.push(dep)
      }
    }

    if (options.sortLists ?? false) {
      normalized.sort(({ ref: a }, { ref: b }) => a.localeCompare(b))
    }

    return normalized
  }

  #normalizeDependency (
    ref: Models.BomRef,
    deps: Models.BomRefRepository,
    allRefs: Map<Models.BomRef, Models.BomRefRepository>,
    options: NormalizerOptions
  ): Normalized.Dependency | undefined {
    const bomRef = ref.toString()
    if (bomRef.length === 0) {
      // no value -> cannot render
      return undefined
    }

    const dependsOn: string[] = normalizeStringableIter(
      Array.from(deps).filter(d => allRefs.has(d) && d !== ref),
      options
    ).filter(d => d.length > 0)

    return {
      ref: bomRef,
      dependsOn: dependsOn.length > 0
        ? dependsOn
        : undefined
    }
  }
}

export class VulnerabilityNormalizer extends BaseJsonNormalizer<Models.Vulnerability.Vulnerability> {
  normalize (data: Models.Vulnerability.Vulnerability, options: NormalizerOptions): Normalized.Vulnerability {
    const source = data.source === undefined
      ? undefined
      : this._factory.makeForVulnerabilitySource().normalize(data.source, options)
    const references = data.references.size > 0
      ? this._factory.makeForVulnerabilityReference().normalizeIterable(data.references, options)
      : undefined

    return {
      id: data.id,
      source,
      references,
      description: data.description,
      detail: data.detail,
      recommendation: data.recommendation,
      created: data.created,
      published: data.published,
      updated: data.updated
    }
  }

  normalizeIterable (data: SortableIterable<Models.Vulnerability.Vulnerability>, options: NormalizerOptions): Normalized.Vulnerability[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(
      c => this.normalize(c, options)
    )
  }
}

export class VulnerabilitySourceNormalizer extends BaseJsonNormalizer<Models.Vulnerability.Source> {
  normalize (data: Models.Vulnerability.Source, options: NormalizerOptions): Normalized.VulnerabilitySource {
    return {
      name: data.name,
      url: data.url?.toString()
    }
  }
}

export class VulnerabilityReferenceNormalizer extends BaseJsonNormalizer<Models.Vulnerability.Reference> {
  normalize (data: Models.Vulnerability.Reference, options: NormalizerOptions): Normalized.VulnerabilityReference {
    return {
      id: data.id,
      source: data.source === undefined
        ? undefined
        : this._factory.makeForVulnerabilitySource().normalize(data.source, options)
    }
  }

  normalizeIterable (data: SortableIterable<Models.Vulnerability.Reference>, options: NormalizerOptions): Normalized.VulnerabilityReference[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(
      c => this.normalize(c, options)
    )
  }
}

/* eslint-enable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions */

function normalizeStringableIter (data: Iterable<Stringable>, options: NormalizerOptions): string[] {
  const r: string[] = Array.from(data, d => d.toString())
  if (options.sortLists ?? false) {
    r.sort((a, b) => a.localeCompare(b))
  }
  return r
}
