import * as Models from "../models";
import {Protocol as SpecProtocol, Version as SpecVersion, Format, UnsupportedFormatError} from "../spec";
import {Protocol as SerializerProtocol} from "./serializer";


const JsonSchemaUrl: ReadonlyMap<SpecVersion, string> = new Map([
    [SpecVersion.v1_2, 'http://cyclonedx.org/schema/bom-1.2b.schema.json'],
    [SpecVersion.v1_3, 'http://cyclonedx.org/schema/bom-1.3a.schema.json'],
    [SpecVersion.v1_4, 'http://cyclonedx.org/schema/bom-1.4.schema.json'],
])

class UnsupportedFormat extends Error {
}

export class Serializer implements SerializerProtocol {
    #normalizerFactory: Normalize.Factory

    /**
     * @throws {UnsupportedFormatError} if spec does not support JSON format.
     */
    constructor(normalizerFactory: Normalize.Factory) {
        if (!normalizerFactory.spec.supportsFormat(Format.JSON)) {
            throw new UnsupportedFormatError('Spec does not support JSON format.')
        }
        this.#normalizerFactory = normalizerFactory
    }

    serialize(bom: Models.Bom): string {
        // @TODO bom-refs values make unique ...
        return JSON.stringify(
            {
                '$schema': JsonSchemaUrl.get(this.#normalizerFactory.spec.version),
                ...this.#normalizerFactory.makeForBom().normalize(bom)
            },
            null,
            4
        )
    }
}


export namespace Normalize {

    export class Factory {
        readonly spec: SpecProtocol

        constructor(spec: SpecProtocol) {
            this.spec = spec
        }

        makeForBom(): BomNormalizer {
            return new BomNormalizer(this)
        }

        makeForMetadata(): MetadataNormalizer {
            return new MetadataNormalizer(this)
        }

        makeForComponent(): ComponentNormalizer {
            return new ComponentNormalizer(this)
        }

        makeForTool(): ToolNormalizer {
            return new ToolNormalizer(this)
        }

        makeForOrganizationalContact(): OrganizationalContactNormalizer {
            return new OrganizationalContactNormalizer(this)
        }

        makeForOrganizationalEntity(): OrganizationalEntityNormalizer {
            return new OrganizationalEntityNormalizer(this)
        }

        makeForHash(): HashNormalizer {
            return new HashNormalizer(this)
        }

        makeForLicense(): LicenseNormalizer {
            return new LicenseNormalizer(this)
        }

        makeForSWID(): SWIDNormalizer {
            return new SWIDNormalizer(this)
        }

        makeForExternalReference(): ExternalReferenceNormalizer {
            return new ExternalReferenceNormalizer(this)
        }

        makeForAttachment(): AttachmentNormalizer {
            return new AttachmentNormalizer(this)
        }
    }


    export interface Protocol {
        normalize(data: any): object | undefined
    }


    abstract class Base implements Protocol {
        protected factory: Factory

        constructor(factory: Factory) {
            this.factory = factory
        }

        abstract normalize(data: any): object | undefined
    }


    export class BomNormalizer extends Base {
        normalize(data: Models.Bom): object {
            return {
                bomFormat: 'CycloneDX',
                specVersion: this.factory.spec.version,
                version: data.version,
                serialNumber: data.serialNumber || undefined,
                metadata: this.factory.makeForMetadata().normalize(data.metadata),
                components: data.components.size > 0
                    ? this.factory.makeForComponent().normalizeIter(data.components)
                    // spec < 1.4 requires `component` to be array
                    : [],
            }
        }
    }


    export class MetadataNormalizer extends Base {
        normalize(data: Models.Metadata): object {
            const toolNormalizer = this.factory.makeForTool()
            const orgContactNormalizer = this.factory.makeForOrganizationalContact()
            const orgEntityNormalizer = this.factory.makeForOrganizationalEntity()
            return {
                timestamp: data.timestamp?.toISOString(),
                tools: data.tools.size > 0
                    ? Array.from(data.tools, t => toolNormalizer.normalize(t))
                    : undefined,
                authors: data.authors.size > 0
                    ? Array.from(data.authors, a => orgContactNormalizer.normalize(a))
                    : undefined,
                component: data.component
                    ? this.factory.makeForComponent().normalize(data.component)
                    : undefined,
                manufacture: data.manufacture
                    ? orgEntityNormalizer.normalize(data.manufacture)
                    : undefined,
                supplier: data.supplier
                    ? orgEntityNormalizer.normalize(data.supplier)
                    : undefined,
            }
        }
    }


    export class ToolNormalizer extends Base {
        normalize(data: Models.Tool): object {
            const hashNormalizer = this.factory.makeForHash()
            return {
                vendor: data.vendor || undefined,
                name: data.name || undefined,
                version: data.version || undefined,
                hashes: data.hashes.size > 0
                    ? hashNormalizer.normalizeIter(data.hashes)
                    : undefined,
            }
        }
    }


    export class HashNormalizer extends Base {
        normalize([algorithm, content]: Models.Hash): object | undefined {
            const spec = this.factory.spec
            return spec.supportsHashAlgorithm(algorithm) && spec.supportsHashValue(content)
                ? {
                    alg: algorithm,
                    content: content,
                } : undefined
        }

        normalizeIter(data: Iterable<Models.Hash>): Array<object> {
            return Array.from(data, h => this.normalize(h))
                .filter(h => undefined !== h) as Array<object>
        }
    }


    export class OrganizationalContactNormalizer extends Base {
        normalize(data: Models.OrganizationalContact): object {
            return {
                name: data.name || undefined,
                // email must conform to https://datatracker.ietf.org/doc/html/rfc6531
                email: data.email || undefined,
                phone: data.phone || undefined,
            }
        }
    }


    export class OrganizationalEntityNormalizer extends Base {
        normalize(data: Models.OrganizationalEntity): object {
            const contactNormalizer = this.factory.makeForOrganizationalContact()
            return {
                name: data.name || undefined,
                url: data.url.size > 0
                    // must comply to https://datatracker.ietf.org/doc/html/rfc3987
                    ? Array.from(data.url, u => u.toString())
                    : undefined,
                contact: data.contact.size > 0
                    ? Array.from(data.contact, c => contactNormalizer.normalize(c))
                    : undefined,
            }
        }
    }


    export class ComponentNormalizer extends Base {

        normalize(data: Models.Component): object | undefined {
            return this.factory.spec.supportsComponentType(data.type)
                ? {
                    type: data.type,
                    name: data.name,
                    group: data.group || undefined,
                    // version fallback to string for spec < 1.4
                    version: data.version || '',
                    'bom-ref': data.bomRef.value || undefined,
                    supplier: data.supplier
                        ? this.factory.makeForOrganizationalEntity().normalize(data.supplier)
                        : undefined,
                    author: data.author || undefined,
                    publisher: data.publisher || undefined,
                    description: data.description || undefined,
                    scope: data.scope || undefined,
                    hashes: data.hashes.size > 0
                        ? this.factory.makeForHash().normalizeIter(data.hashes)
                        : undefined,
                    licenses: data.licenses.size > 0
                        ? this.factory.makeForLicense().normalizeIter(data.licenses)
                        : undefined,
                    copyright: data.copyright || undefined,
                    cpe: data.cpe || undefined,
                    purl: data.purl?.toString(),
                    swid: data.swid
                        ? this.factory.makeForSWID().normalize(data.swid)
                        : undefined,
                    externalReferences: data.externalReferences.size > 0
                        ? this.factory.makeForExternalReference().normalizeIter(data.externalReferences)
                        : undefined,
                } : undefined
        }

        normalizeIter(data: Iterable<Models.Component>): Array<object> {
            return Array.from(data, c => this.normalize(c))
                .filter(c => undefined !== c) as Array<object>
        }

    }

    class LicenseNormalizer extends Base {

        normalize(data: Models.License): object | undefined {
            switch (true) {
                case data instanceof Models.NamedLicense:
                    return this.normalizeNamedLicense(<Models.NamedLicense>data)
                case data instanceof Models.SpdxLicense:
                    return this.normalizeSpdxLicense(<Models.SpdxLicense>data)
                case data instanceof Models.LicenseExpression:
                    return this.normalizeLicenseExpression(<Models.LicenseExpression>data)
                default:
                    throw new RangeError(`unexpected LicenseChoice: ${data}`) as never
            }
        }

        private normalizeNamedLicense = (data: Models.NamedLicense): object => ({
            license: {
                name: data.name,
                text: data.text
                    ? this.factory.makeForAttachment().normalize(data.text)
                    : undefined,
                url: data.url?.toString(),
            }
        });

        private normalizeSpdxLicense = (data: Models.SpdxLicense): object => ({
            license: {
                id: data.id,
                text: data.text
                    ? this.factory.makeForAttachment().normalize(data.text)
                    : undefined,
                url: data.url?.toString(),
            }
        });

        private normalizeLicenseExpression = (data: Models.LicenseExpression): object => ({
            expression: data.value,
        });

        normalizeIter(data: Iterable<Models.License>): Array<object> {
            return Array.from(data, c => this.normalize(c))
                .filter(c => undefined !== c) as Array<object>
        }
    }

    class SWIDNormalizer extends Base {

        normalize(data: Models.SWID): object {
            return {
                tagId: data.tagId,
                name: data.name,
                version: data.version || undefined,
                tagVersion: null === data.tagVersion
                    ? undefined
                    : data.tagVersion,
                patch: null === data.patch
                    ? undefined
                    : data.patch,
                text: data.text
                    ? this.factory.makeForAttachment().normalize(data.text)
                    : undefined,
                url: data.url?.toString(),
            }
        }

    }

    class ExternalReferenceNormalizer extends Base {

        normalize(data: Models.ExternalReference): object | undefined {
            return this.factory.spec.supportsExternalReferenceType(data.type)
                ? {
                    url: data.url.toString(),
                    type: data.type,
                    comment: data.comment || undefined,
                } : undefined
        }

        normalizeIter(data: Iterable<Models.ExternalReference>): Array<object> {
            return Array.from(data, r => this.normalize(r))
                .filter(r => undefined !== r) as Array<object>
        }

    }

    class AttachmentNormalizer extends Base {

        normalize(data: Models.Attachment): object {
            return {
                content: data.content,
                contentType: data.contentType || undefined,
                encoding: data.encoding || undefined,
            }
        }

    }

}
