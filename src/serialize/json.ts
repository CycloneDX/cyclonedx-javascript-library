import * as Models from "../models";
import {Spec, SpecVersion} from "./specs";
import {Serializer as SerializerProtocol} from "./serializer";


export const JsonSchemaUrl: ReadonlyMap<SpecVersion, string | undefined> = new Map([
    [SpecVersion.v1_0, undefined],
    [SpecVersion.v1_1, undefined],
    [SpecVersion.v1_2, 'http://cyclonedx.org/schema/bom-1.2.schema.json'],
    [SpecVersion.v1_3, 'http://cyclonedx.org/schema/bom-1.3.schema.json'],
    [SpecVersion.v1_4, 'http://cyclonedx.org/schema/bom-1.4.schema.json'],
])


export class Serializer implements SerializerProtocol {
    #normalizerFactory: Normalizer.Factory

    constructor(normalizerFactory: Normalizer.Factory) {
        this.#normalizerFactory = normalizerFactory
    }

    serialize(bom: Models.Bom): string {
        // use the fact, that `stringify` will drop `undefined` values automatically
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


export namespace Normalizer {

    export class Factory {
        readonly spec: Spec

        constructor(spec: Spec) {
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
    }


    export interface Protocol {
        normalize(value: any): object
    }


    abstract class Base implements Protocol {
        protected factory: Factory

        constructor(factory: Factory) {
            this.factory = factory
        }

        abstract normalize(data: any): object
    }


    export class BomNormalizer extends Base {
        normalize(data: Models.Bom): object {
            const componentNormalizer = this.factory.makeForComponent()
            return {
                bomFormat: 'CycloneDX',
                specVersion: this.factory.spec.version,
                version: data.version,
                serialNumber: data.serialNumber || undefined,
                metadata: this.factory.makeForMetadata().normalize(data.metadata),
                components: data.components.size > 0
                    ? Array.from(data.components, c => componentNormalizer.normalize(c))
                    : undefined,
            }
        }
    }


    export class MetadataNormalizer extends Base {
        normalize(data: Models.Metadata): object {
            const toolNormalizer = this.factory.makeForTool()
            const orgContactNormalizer = this.factory.makeForOrganizationalContact()
            const orgEntityNormalizer = this.factory.makeForOrganizationalEntity()
            return {
                timestamp: data.timestamp
                    ? data.timestamp.toISOString()
                    : undefined,
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
                    ? Array.from(data.hashes, h => hashNormalizer.normalize(h))
                    : undefined,
            }
        }
    }


    export class HashNormalizer extends Base {
        normalize([algorithm, content]: Models.Hash): object {
            return {
                alg: algorithm,
                content: content,
            }
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
        normalize(data: Models.Component): object {
            return {
                'TODO': 'Component'
            }
        }
    }

}
