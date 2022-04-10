import {PackageURL} from "packageurl-js"

import {Protocol as SpecProtocol, Version as SpecVersion, Format, UnsupportedFormatError} from "../spec"
import {Protocol as SerializerProtocol} from "./serializer"
import {
    Attachment,
    Bom,
    Component,
    ExternalReference,
    Hash,
    LicenseExpression,
    Metadata,
    NamedLicense,
    OrganizationalContact,
    OrganizationalEntity,
    SpdxLicense,
    SWID,
    Tool
} from "../models";


const JsonSchemaUrl: ReadonlyMap<SpecVersion, string> = new Map([
    [SpecVersion.v1_2, 'http://cyclonedx.org/schema/bom-1.2.schema.json'],
    [SpecVersion.v1_3, 'http://cyclonedx.org/schema/bom-1.3.schema.json'],
    [SpecVersion.v1_4, 'http://cyclonedx.org/schema/bom-1.4.schema.json'],
])

export class Serializer implements SerializerProtocol {
    readonly #spec: SpecProtocol

    /**
     * @throws {UnsupportedFormatError} if spec does not support JSON format.
     */
    constructor(spec: SpecProtocol) {
        if (!spec.supportsFormat(Format.JSON)) {
            throw new UnsupportedFormatError('Spec does not support JSON format.')
        }
        this.#spec = spec
    }

    serialize(bom: Bom): string {
        // @TODO bom-refs values make unique ...
        try {
            return JSON.stringify(bom, jsonStringifyReplacer(this.#spec), 4)
        } finally {
            // @TODO reset bom-refs
        }
    }
}

function jsonStringifyReplacer(spec: SpecProtocol): (this: any, key: string, value: any) => any {
    function replaceHashes(hashes: Iterable<Hash>, spec: SpecProtocol) {
        return Array.from(
            hashes,
            ([algorithm, content]: Hash): object | undefined =>
                spec.supportsHashAlgorithm(algorithm)
                    ? {alg: algorithm, content: content}
                    : undefined
        ).filter(h => undefined !== h)
    }

    return function replacer(k: string, v: any): any {
        switch (true) {
            case v === undefined:
            case v === null:
                return undefined
            case v instanceof Array:
                return v.length > 0 ? v : undefined
            case v instanceof Set:
                return v.size > 0 ? Array.from(v) : undefined
            case v instanceof Map:
                return Object.fromEntries(v)
            case v instanceof Date:
            case v instanceof URL:
            case v instanceof PackageURL:
                return v.toString()
            case v instanceof Bom:
                return {
                    '$schema': JsonSchemaUrl.get(spec.version),
                    bomFormat: 'CycloneDX',
                    specVersion: spec.version,
                    version: v.version,
                    serialNumber: v.serialNumber || undefined,
                    metadata: v.metadata,
                    components: v.components,
                }
            case v instanceof Metadata:
                return {
                    timestamp: v.timestamp,
                    tools: v.tools,
                    authors: v.authors,
                    component: v.component,
                    manufacture: v.manufacture,
                    supplier: v.supplier,
                }
            case v instanceof Tool:
                return {
                    vendor: v.vendor || undefined,
                    name: v.name || undefined,
                    version: v.version || undefined,
                    hashes: replaceHashes(v.hashes, spec),
                }
            case v instanceof OrganizationalContact:
                return {
                    name: v.name || undefined,
                    // email must conform to https://datatracker.ietf.org/doc/html/rfc6531
                    email: v.email || undefined,
                    phone: v.phone || undefined,
                }
            case v instanceof OrganizationalEntity:
                return {
                    name: v.name || undefined,
                    url: v.url,
                    contact: v.contact,
                }
            case v instanceof Component:
                return spec.supportsComponentType(v.type)
                    ? {
                        'bom-ref': v.bomRef.value || undefined,
                        type: v.type,
                        name: v.name,
                        group: v.group || undefined,
                        version: v.version || undefined,
                        supplier: v.supplier,
                        author: v.author || undefined,
                        publisher: v.publisher || undefined,
                        description: v.description || undefined,
                        scope: v.scope || undefined,
                        hashes: replaceHashes(v.hashes, spec),
                        licenses: v.licenses,
                        copyright: v.copyright || undefined,
                        cpe: v.cpe || undefined,
                        purl: v.purl,
                        swid: v.swid,
                        externalReferences: v.externalReferences,
                    } : undefined
            case v instanceof NamedLicense:
            case v instanceof SpdxLicense:
                return {
                    license: {
                        name: v.name,
                        id: v.id,
                        text: v.text,
                        url: v.url,
                    }
                }
            case v instanceof LicenseExpression:
                return {
                    expression: v.value,
                }
            case v instanceof SWID:
                return {
                    tagId: v.tagId,
                    name: v.name,
                    version: v.version || undefined,
                    tagVersion: v.tagVersion || undefined,
                    patch: null === v.patch ? undefined : v.patch,
                    text: v.text,
                    url: v.url,
                }
            case v instanceof ExternalReference:
                return spec.supportsExternalReferenceType(v.type)
                    ? {
                        url: v.url,
                        type: v.type,
                        comment: v.comment || undefined,
                    } : undefined
            case v instanceof Attachment:
                return {
                    content: v.content,
                    contentType: v.contentType || undefined,
                    encoding: v.encoding || undefined,
                }
            default:
                return v
        }
    }
}
