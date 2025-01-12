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

/* eslint complexity: ["error", 50 ] -- acknowledged */
/* eslint max-lines: 'off' -- intended */

import { chainI } from "../../_helpers/iterable";
import { isNotUndefined } from '../../_helpers/notUndefined'
import type { SortableIterable } from '../../_helpers/sortable'
import type { Stringable } from '../../_helpers/stringable'
import { treeIteratorSymbol } from '../../_helpers/tree'
import { escapeUri } from '../../_helpers/uri'
import type * as Models from '../../models'
import { LicenseExpression, NamedLicense, SpdxLicense } from '../../models/license'
import { NamedLifecycle } from '../../models/lifecycle'
import { Tool, ToolRepository } from '../../models/tool'
import { AffectedSingleVersion, AffectedVersionRange } from '../../models/vulnerability/affect'
import { isSupportedSpdxId } from '../../spdx'
import type { _SpecProtocol as Spec } from '../../spec/_protocol'
import { Version as SpecVersion } from '../../spec/enums'
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

  makeForService (): ServiceNormalizer {
    return new ServiceNormalizer(this)
  }

  makeForComponentEvidence (): ComponentEvidenceNormalizer {
    return new ComponentEvidenceNormalizer(this)
  }

  makeForLifecycle (): LifecycleNormalizer {
    return new LifecycleNormalizer(this)
  }

  makeForTool (): ToolNormalizer {
    return new ToolNormalizer(this)
  }

  makeForTools (): ToolsNormalizer {
    return new ToolsNormalizer(this)
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

  makeForVulnerabilityRating (): VulnerabilityRatingNormalizer {
    return new VulnerabilityRatingNormalizer(this)
  }

  makeForVulnerabilityAdvisory (): VulnerabilityAdvisoryNormalizer {
    return new VulnerabilityAdvisoryNormalizer(this)
  }

  makeForVulnerabilityCredits (): VulnerabilityCreditsNormalizer {
    return new VulnerabilityCreditsNormalizer(this)
  }

  makeForVulnerabilityAffect (): VulnerabilityAffectNormalizer {
    return new VulnerabilityAffectNormalizer(this)
  }

  makeForVulnerabilityAffectedVersion (): VulnerabilityAffectedVersionNormalizer {
    return new VulnerabilityAffectedVersionNormalizer(this)
  }

  makeForVulnerabilityAnalysis (): VulnerabilityAnalysisNormalizer {
    return new VulnerabilityAnalysisNormalizer(this)
  }
}

const schemaUrl: ReadonlyMap<SpecVersion, string> = new Map([
  [SpecVersion.v1dot6, 'http://cyclonedx.org/schema/bom-1.6.schema.json'],
  [SpecVersion.v1dot5, 'http://cyclonedx.org/schema/bom-1.5.schema.json'],
  [SpecVersion.v1dot4, 'http://cyclonedx.org/schema/bom-1.4.schema.json'],
  [SpecVersion.v1dot3, 'http://cyclonedx.org/schema/bom-1.3a.schema.json'],
  [SpecVersion.v1dot2, 'http://cyclonedx.org/schema/bom-1.2b.schema.json']
])

interface JsonNormalizer<TModel, TNormalized> {
  normalize: (data: TModel, options: NormalizerOptions) => TNormalized | undefined

  normalizeIterable?: (data: SortableIterable<TModel>, options: NormalizerOptions) => TNormalized[]

}

abstract class BaseJsonNormalizer<TModel, TNormalized = object> implements JsonNormalizer<TModel, TNormalized> {
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
      serialNumber: this.#isEligibleSerialNumber(data.serialNumber)
        ? data.serialNumber
        : undefined,
      metadata: this._factory.makeForMetadata().normalize(data.metadata, options),
      components: data.components.size > 0
        ? this._factory.makeForComponent().normalizeIterable(data.components, options)
        // spec < 1.4 requires `component` to be array
        : [],
      services: this._factory.spec.supportsServices && data.services.size > 0
        ? this._factory.makeForService().normalizeIterable(data.services, options)
        : undefined,
      dependencies: this._factory.spec.supportsDependencyGraph
        ? this._factory.makeForDependencyGraph().normalize(data, options)
        : undefined,
      vulnerabilities: this._factory.spec.supportsVulnerabilities && data.vulnerabilities.size > 0
        ? this._factory.makeForVulnerability().normalizeIterable(data.vulnerabilities, options)
        : undefined
    }
  }

  #isEligibleSerialNumber (v: string | undefined): boolean {
    return v !== undefined &&
      // see https://github.com/CycloneDX/specification/blob/ef71717ae0ecb564c0b4c9536d6e9e57e35f2e69/schema/bom-1.4.schema.json#L39
      /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(v)
  }
}

export class MetadataNormalizer extends BaseJsonNormalizer<Models.Metadata> {
  normalize (data: Models.Metadata, options: NormalizerOptions): Normalized.Metadata {
    const orgEntityNormalizer = this._factory.makeForOrganizationalEntity()
    return {
      timestamp: data.timestamp?.toISOString(),
      lifecycles: this._factory.spec.supportsMetadataLifecycles && data.lifecycles.size > 0
        ? this._factory.makeForLifecycle().normalizeIterable(data.lifecycles, options)
        : undefined,
      tools: data.tools.size > 0
        ? this._factory.makeForTools().normalize(data.tools, options)
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
        : orgEntityNormalizer.normalize(data.supplier, options),
      licenses: this._factory.spec.supportsMetadataLicenses && data.licenses.size > 0
        ? this._factory.makeForLicense().normalizeIterable(data.licenses, options)
        : undefined,
      properties: this._factory.spec.supportsMetadataProperties && data.properties.size > 0
        ? this._factory.makeForProperty().normalizeIterable(data.properties, options)
        : undefined
    }
  }
}

export class LifecycleNormalizer extends BaseJsonNormalizer<Models.Lifecycle> {
  normalize (data: Models.Lifecycle, options: NormalizerOptions): Normalized.Lifecycle {
    return data instanceof NamedLifecycle
      ? { name: data.name, description: data.description }
      : { phase: data }
  }

  normalizeIterable (data: SortableIterable<Models.Lifecycle>, options: NormalizerOptions): Normalized.Lifecycle[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(lc => this.normalize(lc, options))
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

  normalizeIterable (data: SortableIterable<Models.Tool>, options: NormalizerOptions): Normalized.Tool[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(t => this.normalize(t, options))
  }
}

export class ToolsNormalizer extends BaseJsonNormalizer<Models.Tools> {
  normalize(data: Models.Tools, options: NormalizerOptions): Normalized.ToolsType {
    if (data.tools.size > 0 || !this._factory.spec.supportsToolsComponentsServices) {
      return this._factory.makeForTool().normalizeIterable(
        new ToolRepository(chainI<Models.Tool>(
          Array.from(data.components, Tool.fromComponent),
          Array.from(data.services, Tool.fromService),
          data.tools,
        )), options)
    }
    return {
      components: data.components.size > 0
        ? this._factory.makeForComponent().normalizeIterable(data.components, options)
        : undefined,
      services: data.services.size > 0
        ? this._factory.makeForService().normalizeIterable(data.services, options)
        : undefined
    }
  }
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

  normalizeIterable (data: SortableIterable<Models.Hash>, options: NormalizerOptions): Normalized.Hash[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(
      h => this.normalize(h, options)
    ).filter(isNotUndefined)
  }
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

  normalizeIterable (data: SortableIterable<Models.OrganizationalContact>, options: NormalizerOptions): Normalized.OrganizationalContact[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(oc => this.normalize(oc, options))
  }
}

export class OrganizationalEntityNormalizer extends BaseJsonNormalizer<Models.OrganizationalEntity> {
  normalize (data: Models.OrganizationalEntity, options: NormalizerOptions): Normalized.OrganizationalEntity {
    const urls = normalizeStringableIter(
      Array.from(data.url, (s) => escapeUri(s.toString())),
      options
    ).filter(JsonSchema.isIriReference)
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

  normalizeIterable (data: SortableIterable<Models.OrganizationalEntity>, options: NormalizerOptions): Normalized.OrganizationalEntity[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(oe => this.normalize(oe, options))
  }
}

export class ComponentNormalizer extends BaseJsonNormalizer<Models.Component> {
  normalize (data: Models.Component, options: NormalizerOptions): Normalized.Component | undefined {
    const spec = this._factory.spec
    if (!spec.supportsComponentType(data.type)) {
      return undefined
    }
    const version: string = data.version ?? ''
    return {
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
      copyright: data.copyright?.toString() || undefined,
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
        : undefined,
      evidence: spec.supportsComponentEvidence && data.evidence !== undefined
        ? this._factory.makeForComponentEvidence().normalize(data.evidence, options)
        : undefined
    }
  }

  normalizeIterable (data: SortableIterable<Models.Component>, options: NormalizerOptions): Normalized.Component[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(
      c => this.normalize(c, options)
    ).filter(isNotUndefined)
  }
}

export class ServiceNormalizer extends BaseJsonNormalizer<Models.Service> {
  normalize (data: Models.Service, options: NormalizerOptions): Normalized.Service {
    const spec = this._factory.spec
    return {
      'bom-ref': data.bomRef.value || undefined,
      provider: data.provider
        ? this._factory.makeForOrganizationalEntity().normalize(data.provider, options)
        : undefined,
      group: data.group,
      name: data.name,
      version: data.version|| undefined,
      description: data.description || undefined,
      licenses: data.licenses.size > 0
        ? this._factory.makeForLicense().normalizeIterable(data.licenses, options)
        : undefined,
      externalReferences: data.externalReferences.size > 0
        ? this._factory.makeForExternalReference().normalizeIterable(data.externalReferences, options)
        : undefined,
      services: data.services.size > 0
        ? this._factory.makeForService().normalizeIterable(data.services, options)
        : undefined,
      properties: spec.supportsProperties(data) && data.properties.size > 0
        ? this._factory.makeForProperty().normalizeIterable(data.properties, options)
        : undefined,
    }
  }

  normalizeIterable (data: SortableIterable<Models.Service>, options: NormalizerOptions): Normalized.Service[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(
      s => this.normalize(s, options)
    )
  }
}

export class ComponentEvidenceNormalizer extends BaseJsonNormalizer<Models.ComponentEvidence> {
  normalize (data: Models.ComponentEvidence, options: NormalizerOptions): Normalized.ComponentEvidence {
    return {
      licenses: data.licenses.size > 0
        ? this._factory.makeForLicense().normalizeIterable(data.licenses, options)
        : undefined,
      copyright: data.copyright.size > 0
        ? (
            options.sortLists
              ? data.copyright.sorted().map(ComponentEvidenceNormalizer.#normalizeCopyright)
              : Array.from(data.copyright, ComponentEvidenceNormalizer.#normalizeCopyright)
          )
        : undefined
    }
  }

  static #normalizeCopyright (c: Stringable): Normalized.Copyright {
    return { text: c.toString() }
  }
}

export class LicenseNormalizer extends BaseJsonNormalizer<Models.License> {
  normalize (data: Models.License, options: NormalizerOptions): Normalized.License {
    switch (true) {
      case data instanceof NamedLicense:
        return this.#normalizeNamedLicense(data, options)
      case data instanceof SpdxLicense:
        return isSupportedSpdxId(data.id)
          ? this.#normalizeSpdxLicense(data, options)
          : this.#normalizeNamedLicense(new NamedLicense(
            // prevent information loss -> convert to broader type
            data.id,
            { url: data.url }
          ), options)
      case data instanceof LicenseExpression:
        return this.#normalizeLicenseExpression(data)
      /* c8 ignore start */
      default:
        // this case is expected to never happen - and therefore is undocumented
        throw new TypeError('Unexpected LicenseChoice')
      /* c8 ignore end */
    }
  }

  #normalizeNamedLicense (data: Models.NamedLicense, options: NormalizerOptions): Normalized.NamedLicense {
    const url = escapeUri(data.url?.toString())
    return {
      license: {
        name: data.name,
        acknowledgement: this._factory.spec.supportsLicenseAcknowledgement
          ? data.acknowledgement
          : undefined,
        text: data.text === undefined
          ? undefined
          : this._factory.makeForAttachment().normalize(data.text, options),
        url: JsonSchema.isIriReference(url)
          ? url
          : undefined
      }
    }
  }

  #normalizeSpdxLicense (data: Models.SpdxLicense, options: NormalizerOptions): Normalized.SpdxLicense {
    const url = escapeUri(data.url?.toString())
    return {
      license: {
        id: data.id,
        acknowledgement: this._factory.spec.supportsLicenseAcknowledgement
          ? data.acknowledgement
          : undefined,
        text: data.text === undefined
          ? undefined
          : this._factory.makeForAttachment().normalize(data.text, options),
        url: JsonSchema.isIriReference(url)
          ? url
          : undefined
      }
    }
  }

  #normalizeLicenseExpression (data: Models.LicenseExpression): Normalized.LicenseExpression {
    return {
      expression: data.expression,
      acknowledgement: this._factory.spec.supportsLicenseAcknowledgement
        ? data.acknowledgement
        : undefined
    }
  }

  /**
   * If there is any {@link Models.LicenseExpression | LicenseExpression} in the set, then this is the only item that is normalized.
   */
  normalizeIterable (data: SortableIterable<Models.License>, options: NormalizerOptions): Normalized.License[] {
    const licenses = options.sortLists ?? false
      ? data.sorted()
      : Array.from(data)

    if (licenses.length > 1) {
      const expressions = licenses.filter(l => l instanceof LicenseExpression)
      if (expressions.length > 0) {
        // could have thrown {@link RangeError} when there is more than one only {@link Models.LicenseExpression | LicenseExpression}.
        // but let's be graceful and just normalize to the most relevant choice: any expression
        return [this.#normalizeLicenseExpression(expressions[0])]
      }
    }

    return licenses.map(l => this.normalize(l, options))
  }
}

export class SWIDNormalizer extends BaseJsonNormalizer<Models.SWID> {
  normalize (data: Models.SWID, options: NormalizerOptions): Normalized.SWID {
    const url = escapeUri(data.url?.toString())
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
          url: escapeUri(data.url.toString()),
          type: data.type,
          hashes: this._factory.spec.supportsExternalReferenceHashes && data.hashes.size > 0
            ? this._factory.makeForHash().normalizeIterable(data.hashes, options)
            : undefined,
          comment: data.comment || undefined
        }
      : undefined
  }

  normalizeIterable (data: SortableIterable<Models.ExternalReference>, options: NormalizerOptions): Normalized.ExternalReference[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(
      r => this.normalize(r, options)
    ).filter(isNotUndefined)
  }
}

export class AttachmentNormalizer extends BaseJsonNormalizer<Models.Attachment> {
  normalize (data: Models.Attachment, options: NormalizerOptions): Normalized.Attachment {
    return {
      content: data.content.toString(),
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

  normalizeIterable (data: SortableIterable<Models.Property>, options: NormalizerOptions): Normalized.Property[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(p => this.normalize(p, options))
  }
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
    for (const service of data.services[treeIteratorSymbol]()) {
      allRefs.set(service.bomRef, service.dependencies)
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
    return {
      'bom-ref': data.bomRef.value || undefined,
      id: data.id || undefined,
      source: data.source === undefined
        ? undefined
        : this._factory.makeForVulnerabilitySource().normalize(data.source, options),
      references: data.references.size > 0
        ? this._factory.makeForVulnerabilityReference().normalizeIterable(data.references, options)
        : undefined,
      ratings: data.ratings.size > 0
        ? this._factory.makeForVulnerabilityRating().normalizeIterable(data.ratings, options)
        : undefined,
      cwes: data.cwes.size > 0
        ? (
            options.sortLists ?? false
              ? data.cwes.sorted()
              : Array.from(data.cwes)
          )
        : undefined,
      description: data.description,
      detail: data.detail,
      recommendation: data.recommendation,
      advisories: data.advisories.size > 0
        ? this._factory.makeForVulnerabilityAdvisory().normalizeIterable(data.advisories, options)
        : undefined,
      created: data.created?.toISOString(),
      published: data.published?.toISOString(),
      updated: data.updated?.toISOString(),
      credits: data.credits === undefined
        ? undefined
        : this._factory.makeForVulnerabilityCredits().normalize(data.credits, options),
      tools: data.tools.size > 0
        ? this._factory.makeForTools().normalize(data.tools, options)
        : undefined,
      analysis: data.analysis === undefined
        ? undefined
        : this._factory.makeForVulnerabilityAnalysis().normalize(data.analysis, options),
      affects: data.affects.size > 0
        ? this._factory.makeForVulnerabilityAffect().normalizeIterable(data.affects, options)
        : undefined,
      properties: data.properties.size > 0
        ? this._factory.makeForProperty().normalizeIterable(data.properties, options)
        : undefined
    }
  }

  normalizeIterable (data: SortableIterable<Models.Vulnerability.Vulnerability>, options: NormalizerOptions): Normalized.Vulnerability[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(v => this.normalize(v, options))
  }
}

export class VulnerabilitySourceNormalizer extends BaseJsonNormalizer<Models.Vulnerability.Source> {
  normalize (data: Models.Vulnerability.Source, options: NormalizerOptions): Normalized.Vulnerability.Source {
    return {
      name: data.name,
      url: data.url?.toString()
    }
  }
}

export class VulnerabilityReferenceNormalizer extends BaseJsonNormalizer<Models.Vulnerability.Reference> {
  normalize (data: Models.Vulnerability.Reference, options: NormalizerOptions): Normalized.Vulnerability.Reference {
    return {
      id: data.id,
      source: this._factory.makeForVulnerabilitySource().normalize(data.source, options)
    }
  }

  normalizeIterable (data: SortableIterable<Models.Vulnerability.Reference>, options: NormalizerOptions): Normalized.Vulnerability.Reference[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(r => this.normalize(r, options))
  }
}

export class VulnerabilityRatingNormalizer extends BaseJsonNormalizer<Models.Vulnerability.Rating> {
  normalize (data: Models.Vulnerability.Rating, options: NormalizerOptions): Normalized.Vulnerability.Rating {
    return {
      source: data.source === undefined
        ? undefined
        : this._factory.makeForVulnerabilitySource().normalize(data.source, options),
      score: data.score,
      severity: data.severity,
      method: this._factory.spec.supportsVulnerabilityRatingMethod(data.method)
        ? data.method
        : undefined,
      vector: data.vector,
      justification: data.justification
    }
  }

  normalizeIterable (data: SortableIterable<Models.Vulnerability.Rating>, options: NormalizerOptions): Normalized.Vulnerability.Rating[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(r => this.normalize(r, options))
  }
}

export class VulnerabilityAdvisoryNormalizer extends BaseJsonNormalizer<Models.Vulnerability.Advisory> {
  normalize (data: Models.Vulnerability.Advisory, options: NormalizerOptions): Normalized.Vulnerability.Advisory | undefined {
    const url = escapeUri(data.url.toString())
    if (!JsonSchema.isIriReference(url)) {
      // invalid value -> cannot render
      return undefined
    }
    return {
      title: data.title,
      url
    }
  }

  normalizeIterable (data: SortableIterable<Models.Vulnerability.Advisory>, options: NormalizerOptions): Normalized.Vulnerability.Advisory[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(
      a => this.normalize(a, options)
    ).filter(isNotUndefined)
  }
}

export class VulnerabilityCreditsNormalizer extends BaseJsonNormalizer<Models.Vulnerability.Credits> {
  normalize (data: Models.Vulnerability.Credits, options: NormalizerOptions): Normalized.Vulnerability.Credits {
    return {
      organizations: data.organizations.size > 0
        ? this._factory.makeForOrganizationalEntity().normalizeIterable(data.organizations, options)
        : undefined,
      individuals: data.individuals.size > 0
        ? this._factory.makeForOrganizationalContact().normalizeIterable(data.individuals, options)
        : undefined
    }
  }
}

export class VulnerabilityAffectNormalizer extends BaseJsonNormalizer<Models.Vulnerability.Affect> {
  normalize (data: Models.Vulnerability.Affect, options: NormalizerOptions): Normalized.Vulnerability.Affect {
    return {
      ref: data.ref.toString(),
      versions: data.versions.size > 0
        ? this._factory.makeForVulnerabilityAffectedVersion().normalizeIterable(data.versions, options)
        : undefined
    }
  }

  normalizeIterable (data: SortableIterable<Models.Vulnerability.Affect>, options: NormalizerOptions): Normalized.Vulnerability.Affect[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(a => this.normalize(a, options))
  }
}

export class VulnerabilityAffectedVersionNormalizer extends BaseJsonNormalizer<Models.Vulnerability.AffectedVersion> {
  normalize (data: Models.Vulnerability.AffectedVersion, options: NormalizerOptions): Normalized.Vulnerability.AffectedVersion | undefined {
    switch (true) {
      case data instanceof AffectedSingleVersion:
        return this.#normalizeAffectedSingleVersion(data)
      case data instanceof AffectedVersionRange:
        return this.#normalizeAffectedVersionRange(data)
      /* c8 ignore start */
      default:
        // this case is expected to never happen - and therefore is undocumented
        throw new TypeError('Unexpected Vulnerability AffectedVersion')
      /* c8 ignore end */
    }
  }

  #normalizeAffectedSingleVersion (data: Models.Vulnerability.AffectedSingleVersion): Normalized.Vulnerability.AffectedSingleVersion | undefined {
    return data.version.length < 1
      // invalid value -> cannot render
      ? undefined
      : {
          version: data.version.substring(0, 1024),
          status: data.status
        }
  }

  #normalizeAffectedVersionRange (data: Models.Vulnerability.AffectedVersionRange): Normalized.Vulnerability.AffectedVersionRange | undefined {
    return data.range.length < 1
      // invalid value -> cannot render
      ? undefined
      : {
          range: data.range.substring(0, 1024),
          status: data.status
        }
  }

  normalizeIterable (data: SortableIterable<Models.Vulnerability.AffectedVersion>, options: NormalizerOptions): Normalized.Vulnerability.AffectedVersion[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(
      av => this.normalize(av, options)
    ).filter(isNotUndefined)
  }
}

export class VulnerabilityAnalysisNormalizer extends BaseJsonNormalizer<Models.Vulnerability.Analysis> {
  normalize (data: Models.Vulnerability.Analysis, options: NormalizerOptions): Normalized.Vulnerability.Analysis {
    return {
      state: data.state,
      justification: data.justification,
      response: data.response.size > 0
        ? (
            options.sortLists ?? false
              ? data.response.sorted()
              : Array.from(data.response)
          )
        : undefined,
      detail: data.detail
    }
  }
}

/* eslint-enable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions */

function normalizeStringableIter (data: Iterable<Stringable>, options: NormalizerOptions): string[] {
  const r = Array.from(data, d => d.toString())
  if (options.sortLists ?? false) {
    r.sort((a, b) => a.localeCompare(b))
  }
  return r
}
