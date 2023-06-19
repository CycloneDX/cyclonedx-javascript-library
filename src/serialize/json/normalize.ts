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
import { isSupportedSpdxId } from '../../spdx'
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

  makeForComponentEvidence (): ComponentEvidenceNormalizer {
    return new ComponentEvidenceNormalizer(this)
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

  normalizeIterable (data: SortableIterable<Models.Tool>, options: NormalizerOptions): Normalized.Tool[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(t => this.normalize(t, options))
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

export class ComponentEvidenceNormalizer extends BaseJsonNormalizer<Models.ComponentEvidence> {
  normalize (data: Models.ComponentEvidence, options: NormalizerOptions): Normalized.ComponentEvidence {
    return {
      licenses: data.licenses.size > 0
        ? this._factory.makeForLicense().normalizeIterable(data.licenses, options)
        : undefined,
      copyright: data.copyright.size > 0
        ? (
            options.sortLists
              ? data.copyright.sorted().map(this.#normalizeCopyright)
              : Array.from(data.copyright, this.#normalizeCopyright)
          )
        : undefined
    }
  }

  #normalizeCopyright (c: Stringable): Normalized.Copyright {
    return { text: c.toString() }
  }
}

export class LicenseNormalizer extends BaseJsonNormalizer<Models.License> {
  normalize (data: Models.License, options: NormalizerOptions): Normalized.License {
    switch (true) {
      case data instanceof Models.NamedLicense:
        return this.#normalizeNamedLicense(data as Models.NamedLicense, options)
      case data instanceof Models.SpdxLicense:
        return isSupportedSpdxId((data as Models.SpdxLicense).id)
          ? this.#normalizeSpdxLicense(data as Models.SpdxLicense, options)
          : this.#normalizeNamedLicense(new Models.NamedLicense(
            // prevent information loss -> convert to broader type
            (data as Models.SpdxLicense).id,
            { url: (data as Models.SpdxLicense).url }
          ), options)
      case data instanceof Models.LicenseExpression:
        return this.#normalizeLicenseExpression(data as Models.LicenseExpression)
      /* c8 ignore start */
      default:
        // this case is expected to never happen - and therefore is undocumented
        throw new TypeError('Unexpected LicenseChoice')
      /* c8 ignore end */
    }
  }

  #normalizeNamedLicense (data: Models.NamedLicense, options: NormalizerOptions): Normalized.NamedLicense {
    const url = data.url?.toString()
    return {
      license: {
        name: data.name,
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

  /**
   * If there is any {@link Models.LicenseExpression | LicenseExpression} in the set, then this is the only item that is normalized.
   */
  normalizeIterable (data: SortableIterable<Models.License>, options: NormalizerOptions): Normalized.License[] {
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
        ? this._factory.makeForTool().normalizeIterable(data.tools, options)
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
      method: data.method,
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
    const url = data.url.toString()
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
      case data instanceof Models.Vulnerability.AffectedSingleVersion:
        return this.#normalizeAffectedSingleVersion(data as Models.Vulnerability.AffectedSingleVersion)
      case data instanceof Models.Vulnerability.AffectedVersionRange:
        return this.#normalizeAffectedVersionRange(data as Models.Vulnerability.AffectedVersionRange)
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
