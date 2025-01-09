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
import { Tool, ToolRepository } from "../../models";
import { LicenseExpression, NamedLicense, SpdxLicense } from '../../models/license'
import { NamedLifecycle } from '../../models/lifecycle'
import { AffectedSingleVersion, AffectedVersionRange } from '../../models/vulnerability/affect'
import { isSupportedSpdxId } from '../../spdx'
import type { _SpecProtocol as Spec } from '../../spec/_protocol'
import { Version as SpecVersion } from '../../spec/enums'
import type { NormalizerOptions } from '../types'
import { normalizedString, token} from './_xsd'
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

  makeForLifecycle (): LifecycleNormalizer {
    return new LifecycleNormalizer(this)
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

const xmlNamespace: ReadonlyMap<SpecVersion, string> = new Map([
  [SpecVersion.v1dot6, 'http://cyclonedx.org/schema/bom/1.6'],
  [SpecVersion.v1dot5, 'http://cyclonedx.org/schema/bom/1.5'],
  [SpecVersion.v1dot4, 'http://cyclonedx.org/schema/bom/1.4'],
  [SpecVersion.v1dot3, 'http://cyclonedx.org/schema/bom/1.3'],
  [SpecVersion.v1dot2, 'http://cyclonedx.org/schema/bom/1.2'],
  [SpecVersion.v1dot1, 'http://cyclonedx.org/schema/bom/1.1'],
  [SpecVersion.v1dot0, 'http://cyclonedx.org/schema/bom/1.0']
])

interface XmlNormalizer<TModel, TNormalized> {
  normalize: (data: TModel, options: NormalizerOptions, elementName?: string) => TNormalized | undefined

  normalizeIterable?: (data: SortableIterable<TModel>, options: NormalizerOptions, elementName: string) => TNormalized[]
}

abstract class BaseXmlNormalizer<TModel, TNormalized = SimpleXml.Element> implements XmlNormalizer<TModel, TNormalized> {
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
    const services: SimpleXml.Element | undefined = this._factory.spec.supportsServices  && data.services.size > 0
    ? {
        type: 'element',
        name: 'services',
        children: this._factory.makeForService().normalizeIterable(data.services, options, 'service')
      }
      : undefined
    const vulnerabilities: SimpleXml.Element | undefined = this._factory.spec.supportsVulnerabilities && data.vulnerabilities.size > 0
      ? {
          type: 'element',
          name: 'vulnerabilities',
          children: this._factory.makeForVulnerability().normalizeIterable(data.vulnerabilities, options, 'vulnerability')
        }
      : undefined
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
        this._factory.makeForMetadata().normalize(data.metadata, options, 'metadata'),
        components,
        services,
        this._factory.spec.supportsDependencyGraph
          ? this._factory.makeForDependencyGraph().normalize(data, options, 'dependencies')
          : undefined,
        vulnerabilities
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
    const lifecycles: SimpleXml.Element | undefined = this._factory.spec.supportsMetadataLifecycles && data.lifecycles.size > 0
      ? {
          type: 'element',
          name: 'lifecycles',
          children: this._factory.makeForLifecycle().normalizeIterable(data.lifecycles, options, 'lifecycle')
        }
      : undefined
    const tools: SimpleXml.Element | undefined = data.tools.size > 0
      ? this._factory.makeForTools().normalize(data.tools, options, 'tools')
      : undefined
    const authors: SimpleXml.Element | undefined = data.authors.size > 0
      ? {
          type: 'element',
          name: 'authors',
          children: this._factory.makeForOrganizationalContact().normalizeIterable(data.authors, options, 'author')
        }
      : undefined
    const licenses: SimpleXml.Element | undefined = this._factory.spec.supportsMetadataLicenses && data.licenses.size > 0
      ? {
          type: 'element',
          name: 'licenses',
          children: this._factory.makeForLicense().normalizeIterable(data.licenses, options)
        }
      : undefined
    const properties: SimpleXml.Element | undefined = this._factory.spec.supportsMetadataProperties && data.properties.size > 0
      ? {
          type: 'element',
          name: 'properties',
          children: this._factory.makeForProperty().normalizeIterable(data.properties, options, 'property')
        }
      : undefined
    return {
      type: 'element',
      name: elementName,
      children: [
        makeOptionalDateTimeElement(data.timestamp, 'timestamp'),
        lifecycles,
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
          : orgEntityNormalizer.normalize(data.supplier, options, 'supplier'),
        licenses,
        properties
      ].filter(isNotUndefined)
    }
  }
}

export class LifecycleNormalizer extends BaseXmlNormalizer<Models.Lifecycle> {
  normalize (data: Models.Lifecycle, options: NormalizerOptions, elementName: string): SimpleXml.Element {
    return data instanceof NamedLifecycle
      ? {
          type: 'element',
          name: elementName,
          children: [
            makeTextElement(data.name, 'name', normalizedString),
            makeOptionalTextElement(data.description, 'description')
          ].filter(isNotUndefined)
        }
      : {
          type: 'element',
          name: elementName,
          children: [
            makeTextElement(data, 'phase')
          ]
        }
  }

  normalizeIterable (data: SortableIterable<Models.Lifecycle>, options: NormalizerOptions, elementName: string): SimpleXml.Element[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(t => this.normalize(t, options, elementName))
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
            children: this._factory.makeForExternalReference().normalizeIterable(data.externalReferences, options, 'reference')
          }
        : undefined
    return {
      type: 'element',
      name: elementName,
      children: [
        makeOptionalTextElement(data.vendor, 'vendor', normalizedString),
        makeOptionalTextElement(data.name, 'name', normalizedString),
        makeOptionalTextElement(data.version, 'version', normalizedString),
        hashes,
        externalReferences
      ].filter(isNotUndefined)
    }
  }

  normalizeIterable (data: SortableIterable<Models.Tool>, options: NormalizerOptions, elementName: string): SimpleXml.Element[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(t => this.normalize(t, options, elementName))
  }
}

export class ToolsNormalizer extends BaseXmlNormalizer<Models.Tools> {
  normalize (data: Models.Tools, options: NormalizerOptions, elementName: string): SimpleXml.Element {
    let children: SimpleXml.Element[] = []
    if (data.tools.size > 0 || !this._factory.spec.supportsToolsComponentsServices) {
      children = this._factory.makeForTool().normalizeIterable(
        new ToolRepository(chainI(
          Array.from(data.components, Tool.fromComponent),
          Array.from(data.services, Tool.fromService),
          data.tools,
        )), options, 'tool')
    } else {
      if (data.components.size > 0) {
        children.push({
          type: 'element',
          name: 'components',
          children: this._factory.makeForComponent().normalizeIterable(data.components, options, 'component')
        })
      }
      if (data.services.size > 0) {
        children.push({
          type: 'element',
          name: 'services',
          children: this._factory.makeForService().normalizeIterable(data.services, options, 'service')
        })
      }
    }
    return {
      type: 'element',
      name: elementName,
      children
    }
  }
}

export class HashNormalizer extends BaseXmlNormalizer<Models.Hash> {
  normalize ([algorithm, content]: Models.Hash, options: NormalizerOptions, elementName: string): SimpleXml.Element | undefined {
    const spec = this._factory.spec
    return spec.supportsHashAlgorithm(algorithm) && spec.supportsHashValue(content)
      ? {
          type: 'element',
          name: elementName,
          attributes: { alg: algorithm },
          children: token(content)
        }
      : undefined
  }

  normalizeIterable (data: SortableIterable<Models.Hash>, options: NormalizerOptions, elementName: string): SimpleXml.Element[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(
      h => this.normalize(h, options, elementName)
    ).filter(isNotUndefined)
  }
}

export class OrganizationalContactNormalizer extends BaseXmlNormalizer<Models.OrganizationalContact> {
  normalize (data: Models.OrganizationalContact, options: NormalizerOptions, elementName: string): SimpleXml.Element {
    return {
      type: 'element',
      name: elementName,
      children: [
        makeOptionalTextElement(data.name, 'name', normalizedString),
        makeOptionalTextElement(data.email, 'email', normalizedString),
        makeOptionalTextElement(data.phone, 'phone', normalizedString)
      ].filter(isNotUndefined)
    }
  }

  normalizeIterable (data: SortableIterable<Models.OrganizationalContact>, options: NormalizerOptions, elementName: string): SimpleXml.Element[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(oc => this.normalize(oc, options, elementName))
  }
}

export class OrganizationalEntityNormalizer extends BaseXmlNormalizer<Models.OrganizationalEntity> {
  normalize (data: Models.OrganizationalEntity, options: NormalizerOptions, elementName: string): SimpleXml.Element {
    return {
      type: 'element',
      name: elementName,
      children: [
        makeOptionalTextElement(data.name, 'name', normalizedString),
        ...makeTextElementIter(Array.from(
          data.url, (s): string => escapeUri(s.toString())
        ), options, 'url'
        ).filter(({ children: u }) => XmlSchema.isAnyURI(u)),
        ...this._factory.makeForOrganizationalContact().normalizeIterable(data.contact, options, 'contact')
      ].filter(isNotUndefined)
    }
  }

  normalizeIterable (data: SortableIterable<Models.OrganizationalEntity>, options: NormalizerOptions, elementName: string): SimpleXml.Element[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(oe => this.normalize(oe, options, elementName))
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
      'version',
      normalizedString
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
          children: this._factory.makeForExternalReference().normalizeIterable(data.externalReferences, options, 'reference')
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
    const evidence: SimpleXml.Element | undefined = spec.supportsComponentEvidence && data.evidence !== undefined
      ? this._factory.makeForComponentEvidence().normalize(data.evidence, options, 'evidence')
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
        makeOptionalTextElement(data.author, 'author', normalizedString),
        makeOptionalTextElement(data.publisher, 'publisher', normalizedString),
        makeOptionalTextElement(data.group, 'group', normalizedString),
        makeTextElement(data.name, 'name', normalizedString),
        version,
        makeOptionalTextElement(data.description, 'description', normalizedString),
        makeOptionalTextElement(data.scope, 'scope'),
        hashes,
        licenses,
        makeOptionalTextElement(data.copyright, 'copyright', normalizedString),
        makeOptionalTextElement(data.cpe, 'cpe'),
        makeOptionalTextElement(data.purl, 'purl'),
        swid,
        extRefs,
        properties,
        components,
        evidence
      ].filter(isNotUndefined)
    }
  }

  normalizeIterable (data: SortableIterable<Models.Component>, options: NormalizerOptions, elementName: string): SimpleXml.Element[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(
      c => this.normalize(c, options, elementName)
    ).filter(isNotUndefined)
  }
}

export class ServiceNormalizer extends BaseXmlNormalizer<Models.Service> {
  normalize (data: Models.Service, options: NormalizerOptions, elementName: string): SimpleXml.Element {
    const spec = this._factory.spec
    const provider: SimpleXml.Element | undefined = data.provider === undefined
      ? undefined
      : this._factory.makeForOrganizationalEntity().normalize(data.provider, options, 'provider')
    const licenses: SimpleXml.Element | undefined = data.licenses.size > 0
      ? {
        type: 'element',
        name: 'licenses',
        children: this._factory.makeForLicense().normalizeIterable(data.licenses, options)
      }
      : undefined
    const extRefs: SimpleXml.Element | undefined = data.externalReferences.size > 0
      ? {
        type: 'element',
        name: 'externalReferences',
        children: this._factory.makeForExternalReference().normalizeIterable(data.externalReferences, options, 'reference')
      }
      : undefined
    const properties: SimpleXml.Element | undefined = spec.supportsProperties(data) && data.properties.size > 0
      ? {
        type: 'element',
        name: 'properties',
        children: this._factory.makeForProperty().normalizeIterable(data.properties, options, 'property')
      }
      : undefined
    const services: SimpleXml.Element | undefined = data.services.size > 0
      ? {
        type: 'element',
        name: 'services',
        children: this.normalizeIterable(data.services, options, 'service')
      }
      : undefined
    return {
      type: 'element',
      name: elementName,
      attributes: {
        'bom-ref': data.bomRef.value
      },
      children: [
        provider,
        makeOptionalTextElement(data.group, 'group', normalizedString),
        makeTextElement(data.name, 'name', normalizedString),
        makeOptionalTextElement(data.version, 'version', normalizedString),
        makeOptionalTextElement(data.description, 'description', normalizedString),
        licenses,
        extRefs,
        properties,
        services,
      ].filter(isNotUndefined)
    }
  }

  normalizeIterable (data: SortableIterable<Models.Service>, options: NormalizerOptions, elementName: string): SimpleXml.Element[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(
      s => this.normalize(s, options, elementName)
    )
  }
}


export class ComponentEvidenceNormalizer extends BaseXmlNormalizer<Models.ComponentEvidence> {
  normalize (data: Models.ComponentEvidence, options: NormalizerOptions, elementName: string): SimpleXml.Element {
    const licenses: SimpleXml.Element | undefined = data.licenses.size > 0
      ? {
          type: 'element',
          name: 'licenses',
          children: this._factory.makeForLicense().normalizeIterable(data.licenses, options)
        }
      : undefined
    const copyright: SimpleXml.Element | undefined = data.copyright.size > 0
      ? {
          type: 'element',
          name: 'copyright',
          children: makeTextElementIter(data.copyright, options, 'text')
        }
      : undefined
    return {
      type: 'element',
      name: elementName,
      children: [
        licenses,
        copyright
      ].filter(isNotUndefined)
    }
  }
}

export class LicenseNormalizer extends BaseXmlNormalizer<Models.License> {
  normalize (data: Models.License, options: NormalizerOptions): SimpleXml.Element {
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

  #normalizeNamedLicense (data: Models.NamedLicense, options: NormalizerOptions): SimpleXml.Element {
    const url = escapeUri(data.url?.toString())
    return {
      type: 'element',
      name: 'license',
      attributes: {
        acknowledgement: this._factory.spec.supportsLicenseAcknowledgement
          ? data.acknowledgement
          : undefined
      },
      children: [
        makeTextElement(data.name, 'name', normalizedString),
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
    const url = escapeUri(data.url?.toString())
    return {
      type: 'element',
      name: 'license',
      attributes: {
        acknowledgement: this._factory.spec.supportsLicenseAcknowledgement
          ? data.acknowledgement
          : undefined
      },
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
    const elem = makeTextElement(data.expression, 'expression', normalizedString)
    elem.attributes = {
      acknowledgement: this._factory.spec.supportsLicenseAcknowledgement
        ? data.acknowledgement
        : undefined
    }
    return elem
  }

  /**
   * If there is any {@link Models.LicenseExpression | LicenseExpression} in the set, then this is the only item that is normalized.
   */
  normalizeIterable (data: SortableIterable<Models.License>, options: NormalizerOptions): SimpleXml.Element[] {
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

export class SWIDNormalizer extends BaseXmlNormalizer<Models.SWID> {
  normalize (data: Models.SWID, options: NormalizerOptions, elementName: string): SimpleXml.Element {
    const url = escapeUri(data.url?.toString())
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
    const url = escapeUri(data.url.toString())
    const hashes: SimpleXml.Element | undefined = this._factory.spec.supportsExternalReferenceHashes && data.hashes.size > 0
      ? {
          type: 'element',
          name: 'hashes',
          children: this._factory.makeForHash().normalizeIterable(data.hashes, options, 'hash')
        }
      : undefined
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
            makeOptionalTextElement(data.comment, 'comment'),
            hashes
          ].filter(isNotUndefined)
        }
      : undefined
  }

  normalizeIterable (data: SortableIterable<Models.ExternalReference>, options: NormalizerOptions, elementName: string): SimpleXml.Element[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(
      r => this.normalize(r, options, elementName)
    ).filter(isNotUndefined)
  }
}

export class AttachmentNormalizer extends BaseXmlNormalizer<Models.Attachment> {
  normalize (data: Models.Attachment, options: NormalizerOptions, elementName: string): SimpleXml.Element {
    return {
      type: 'element',
      name: elementName,
      attributes: {
        'content-type': data.contentType
          ? normalizedString(data.contentType)
          : undefined,
        encoding: data.encoding || undefined
      },
      children: data.content.toString()
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
      children: normalizedString(data.value)
    }
  }

  normalizeIterable (data: SortableIterable<Models.Property>, options: NormalizerOptions, elementName: string): SimpleXml.Element[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(p => this.normalize(p, options, elementName))
  }
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
    for (const service of data.services[treeIteratorSymbol]()) {
      allRefs.set(service.bomRef, service.dependencies)
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

export class VulnerabilityNormalizer extends BaseXmlNormalizer<Models.Vulnerability.Vulnerability> {
  normalize (data: Models.Vulnerability.Vulnerability, options: NormalizerOptions, elementName: string): SimpleXml.Element {
    const references: SimpleXml.Element | undefined = data.references.size > 0
      ? {
          type: 'element',
          name: 'references',
          children: this._factory.makeForVulnerabilityReference().normalizeIterable(data.references, options, 'reference')
        }
      : undefined
    const ratings: SimpleXml.Element | undefined = data.ratings.size > 0
      ? {
          type: 'element',
          name: 'ratings',
          children: this._factory.makeForVulnerabilityRating().normalizeIterable(data.ratings, options, 'rating')
        }
      : undefined
    const cwes: SimpleXml.Element | undefined = data.cwes.size > 0
      ? {
          type: 'element',
          name: 'cwes',
          children: (
            options.sortLists
              ? data.cwes.sorted()
              : Array.from(data.cwes)
          ).map(cwe => makeTextElement(cwe, 'cwe'))
        }
      : undefined
    const advisories: SimpleXml.Element | undefined = data.advisories.size > 0
      ? {
          type: 'element',
          name: 'advisories',
          children: this._factory.makeForVulnerabilityAdvisory().normalizeIterable(data.advisories, options, 'advisory')
        }
      : undefined
    const tools: SimpleXml.Element | undefined = data.tools.size > 0
      ? this._factory.makeForTools().normalize(data.tools, options, 'tools')
      : undefined
    const affects: SimpleXml.Element | undefined = data.affects.size > 0
      ? {
          type: 'element',
          name: 'affects',
          children: this._factory.makeForVulnerabilityAffect().normalizeIterable(data.affects, options, 'target')
        }
      : undefined
    const properties: SimpleXml.Element | undefined = data.properties.size > 0
      ? {
          type: 'element',
          name: 'properties',
          children: this._factory.makeForProperty().normalizeIterable(data.properties, options, 'property')
        }
      : undefined
    return {
      type: 'element',
      name: elementName,
      attributes: { 'bom-ref': data.bomRef.value || undefined },
      children: [
        makeOptionalTextElement(data.id, 'id', normalizedString),
        data.source === undefined
          ? undefined
          : this._factory.makeForVulnerabilitySource().normalize(data.source, options, 'source'),
        references,
        ratings,
        cwes,
        makeOptionalTextElement(data.description, 'description'),
        makeOptionalTextElement(data.detail, 'detail'),
        makeOptionalTextElement(data.recommendation, 'recommendation'),
        advisories,
        makeOptionalDateTimeElement(data.created, 'created'),
        makeOptionalDateTimeElement(data.created, 'published'),
        makeOptionalDateTimeElement(data.created, 'updated'),
        data.credits === undefined
          ? undefined
          : this._factory.makeForVulnerabilityCredits().normalize(data.credits, options, 'credits'),
        tools,
        data.analysis === undefined
          ? undefined
          : this._factory.makeForVulnerabilityAnalysis().normalize(data.analysis, options, 'analysis'),
        affects,
        properties
      ].filter(isNotUndefined)
    }
  }

  normalizeIterable (data: SortableIterable<Models.Vulnerability.Vulnerability>, options: NormalizerOptions, elementName: string): SimpleXml.Element[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(v => this.normalize(v, options, elementName))
  }
}

export class VulnerabilitySourceNormalizer extends BaseXmlNormalizer<Models.Vulnerability.Source> {
  normalize (data: Models.Vulnerability.Source, options: NormalizerOptions, elementName: string): SimpleXml.Element {
    const url = escapeUri(data.url?.toString())
    return {
      type: 'element',
      name: elementName,
      children: [
        makeOptionalTextElement(data.name, 'name', normalizedString),
        XmlSchema.isAnyURI(url)
          ? makeTextElement(url, 'url')
          : undefined
      ].filter(isNotUndefined)
    }
  }
}

export class VulnerabilityReferenceNormalizer extends BaseXmlNormalizer<Models.Vulnerability.Reference> {
  normalize (data: Models.Vulnerability.Reference, options: NormalizerOptions, elementName: string): SimpleXml.Element {
    return {
      type: 'element',
      name: elementName,
      children: [
        makeTextElement(data.id, 'id'),
        this._factory.makeForVulnerabilitySource().normalize(data.source, options, 'source')
      ]
    }
  }

  normalizeIterable (data: SortableIterable<Models.Vulnerability.Reference>, options: NormalizerOptions, elementName: string): SimpleXml.Element[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(r => this.normalize(r, options, elementName))
  }
}

export class VulnerabilityRatingNormalizer extends BaseXmlNormalizer<Models.Vulnerability.Rating> {
  normalize (data: Models.Vulnerability.Rating, options: NormalizerOptions, elementName: string): SimpleXml.Element {
    return {
      type: 'element',
      name: elementName,
      children: [
        data.source === undefined
          ? undefined
          : this._factory.makeForVulnerabilitySource().normalize(data.source, options, 'source'),
        makeOptionalTextElement(data.score, 'score'),
        makeOptionalTextElement(data.severity, 'severity'),
        this._factory.spec.supportsVulnerabilityRatingMethod(data.method)
          ? makeOptionalTextElement(data.method, 'method')
          : undefined,
        makeOptionalTextElement(data.vector, 'vector', normalizedString),
        makeOptionalTextElement(data.justification, 'justification')
      ].filter(isNotUndefined)
    }
  }

  normalizeIterable (data: SortableIterable<Models.Vulnerability.Rating>, options: NormalizerOptions, elementName: string): SimpleXml.Element[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(r => this.normalize(r, options, elementName))
  }
}

export class VulnerabilityAdvisoryNormalizer extends BaseXmlNormalizer<Models.Vulnerability.Advisory> {
  normalize (data: Models.Vulnerability.Advisory, options: NormalizerOptions, elementName: string): SimpleXml.Element | undefined {
    const url = escapeUri(data.url.toString())
    if (!XmlSchema.isAnyURI(url)) {
      // invalid value -> cannot render
      return undefined
    }
    return {
      type: 'element',
      name: elementName,
      children: [
        makeOptionalTextElement(data.title, 'title'),
        makeTextElement(url, 'url')
      ].filter(isNotUndefined)
    }
  }

  normalizeIterable (data: SortableIterable<Models.Vulnerability.Advisory>, options: NormalizerOptions, elementName: string): SimpleXml.Element[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(
      a => this.normalize(a, options, elementName)
    ).filter(isNotUndefined)
  }
}

export class VulnerabilityCreditsNormalizer extends BaseXmlNormalizer<Models.Vulnerability.Credits> {
  normalize (data: Models.Vulnerability.Credits, options: NormalizerOptions, elementName: string): SimpleXml.Element {
    const organizations: SimpleXml.Element | undefined = data.organizations.size > 0
      ? {
          type: 'element',
          name: 'organizations',
          children: this._factory.makeForOrganizationalEntity().normalizeIterable(data.organizations, options, 'organization')
        }
      : undefined
    const individuals: SimpleXml.Element | undefined = data.individuals.size > 0
      ? {
          type: 'element',
          name: 'individuals',
          children: this._factory.makeForOrganizationalContact().normalizeIterable(data.individuals, options, 'individual')
        }
      : undefined
    return {
      type: 'element',
      name: elementName,
      children: [
        organizations,
        individuals
      ].filter(isNotUndefined)
    }
  }
}

export class VulnerabilityAnalysisNormalizer extends BaseXmlNormalizer<Models.Vulnerability.Analysis> {
  normalize (data: Models.Vulnerability.Analysis, options: NormalizerOptions, elementName: string): SimpleXml.Element {
    const responses: SimpleXml.Element | undefined = data.response.size > 0
      ? {
          type: 'element',
          name: 'responses',
          children: (
            options.sortLists ?? false
              ? data.response.sorted()
              : Array.from(data.response)
          ).map(ar => makeTextElement(ar, 'response'))
        }
      : undefined
    return {
      type: 'element',
      name: elementName,
      children: [
        makeOptionalTextElement(data.state, 'state'),
        makeOptionalTextElement(data.justification, 'justification'),
        responses,
        makeOptionalTextElement(data.detail, 'detail')
      ].filter(isNotUndefined)
    }
  }
}

export class VulnerabilityAffectNormalizer extends BaseXmlNormalizer<Models.Vulnerability.Affect> {
  normalize (data: Models.Vulnerability.Affect, options: NormalizerOptions, elementName: string): SimpleXml.Element {
    const versions: SimpleXml.Element | undefined = data.versions.size > 0
      ? {
          type: 'element',
          name: 'versions',
          children: this._factory.makeForVulnerabilityAffectedVersion().normalizeIterable(data.versions, options, 'version')
        }
      : undefined
    return {
      type: 'element',
      name: elementName,
      children: [
        makeTextElement(data.ref, 'ref'),
        versions
      ].filter(isNotUndefined)
    }
  }

  normalizeIterable (data: SortableIterable<Models.Vulnerability.Affect>, options: NormalizerOptions, elementName: string): SimpleXml.Element[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(a => this.normalize(a, options, elementName))
  }
}

export class VulnerabilityAffectedVersionNormalizer extends BaseXmlNormalizer<Models.Vulnerability.AffectedVersion> {
  normalize (data: Models.Vulnerability.AffectedVersion, options: NormalizerOptions, elementName: string): SimpleXml.Element {
    switch (true) {
      case data instanceof AffectedSingleVersion:
        return this.#normalizeAffectedSingleVersion(data, elementName)
      case data instanceof AffectedVersionRange:
        return this.#normalizeAffectedVersionRange(data, elementName)
      /* c8 ignore start */
      default:
        // this case is expected to never happen - and therefore is undocumented
        throw new TypeError('Unexpected Vulnerability AffectedVersion')
      /* c8 ignore end */
    }
  }

  #normalizeAffectedSingleVersion (data: Models.Vulnerability.AffectedSingleVersion, elementName: string): SimpleXml.Element {
    return {
      type: 'element',
      name: elementName,
      children: [
        makeTextElement(data.version, 'version', normalizedString),
        makeOptionalTextElement(data.status, 'status')
      ].filter(isNotUndefined)
    }
  }

  #normalizeAffectedVersionRange (data: Models.Vulnerability.AffectedVersionRange, elementName: string): SimpleXml.Element {
    return {
      type: 'element',
      name: elementName,
      children: [
        makeTextElement(data.range, 'range', normalizedString),
        makeOptionalTextElement(data.status, 'status')
      ].filter(isNotUndefined)
    }
  }

  normalizeIterable (data: SortableIterable<Models.Vulnerability.AffectedVersion>, options: NormalizerOptions, elementName: string): SimpleXml.Element[] {
    return (
      options.sortLists ?? false
        ? data.sorted()
        : Array.from(data)
    ).map(av => this.normalize(av, options, elementName))
  }
}

/* eslint-enable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions */

type StrictTextElement = SimpleXml.TextElement & { children: string }

type TextElementModifier = (i:string) => string
const noTEM: TextElementModifier = (s) => s

function makeOptionalTextElement (data: null | undefined | Stringable, elementName: string, mod: TextElementModifier = noTEM): undefined | StrictTextElement {
  const s = mod(data?.toString() ?? '')
  return s.length > 0
    ? makeTextElement(s, elementName)
    : undefined
}

function makeTextElement (data: Stringable, elementName: string, mod: TextElementModifier = noTEM): StrictTextElement {
  return {
    type: 'element',
    name: elementName,
    children: mod(data.toString())
  }
}

function makeTextElementIter (data: Iterable<Stringable>, options: NormalizerOptions, elementName: string, mod: TextElementModifier = noTEM): StrictTextElement[] {
  const r: StrictTextElement[] = Array.from(data, d => makeTextElement(d, elementName, mod))
  if (options.sortLists ?? false) {
    r.sort(({ children: a }, { children: b }) => a.localeCompare(b))
  }
  return r
}

function makeOptionalDateTimeElement (data: null | undefined | Date, elementName: string, mod: TextElementModifier = noTEM): undefined | StrictTextElement {
  const d = data?.toISOString()
  return d === undefined
    ? undefined
    : makeTextElement(d, elementName, mod)
}
