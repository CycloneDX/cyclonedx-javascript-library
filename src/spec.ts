import {ComponentType, ExternalReferenceType, HashAlgorithm} from "./enums/";


export enum Version {
    v1_4 = '1.4',
    v1_3 = '1.3',
    v1_2 = '1.2',
    v1_1 = '1.1',
    v1_0 = '1.0',
}


export enum Format {
    JSON = 'json',
    XML = 'xml',
}

export class UnsupportedFormatError extends Error {}


export interface Protocol {
    readonly version: Version

    supportsFormat(f: Format | any): boolean

    supportsComponentType(ct: ComponentType | any): boolean;

    supportsHashAlgorithm(ha: HashAlgorithm | any): boolean;

    supportsExternalReferenceType(ert: ExternalReferenceType | any): boolean;
}

class Spec implements Protocol {

    readonly #version: Version
    readonly #supportedFormats: ReadonlySet<Format>
    readonly #supportedComponentTypes: ReadonlySet<ComponentType>
    readonly #supportedHashAlgorithms: ReadonlySet<HashAlgorithm>
    readonly #supportedExternalReferenceTypes: ReadonlySet<ExternalReferenceType>

    constructor(
        version: Version,
        supportedFormats: Iterable<Format>,
        supportedComponentTypes: Iterable<ComponentType>,
        supportedHashAlgorithms: Iterable<HashAlgorithm>,
        supportedExternalReferenceTypes: Iterable<ExternalReferenceType>
    ) {
        this.#version = version
        this.#supportedFormats = new Set(supportedFormats)
        this.#supportedComponentTypes = new Set(supportedComponentTypes)
        this.#supportedHashAlgorithms = new Set(supportedHashAlgorithms)
        this.#supportedExternalReferenceTypes = new Set(supportedExternalReferenceTypes)
    }

    get version(): Version {
        return this.#version
    }

    supportsFormat(f: Format | any): boolean {
        return this.#supportedFormats.has(f)
    }

    supportsComponentType(ct: ComponentType | any): boolean {
        return this.#supportedComponentTypes.has(ct)
    }

    supportsHashAlgorithm(ha: HashAlgorithm | any): boolean {
        return this.#supportedHashAlgorithms.has(ha)
    }

    supportsExternalReferenceType(ert: ExternalReferenceType | any): boolean {
        return this.#supportedExternalReferenceTypes.has(ert)
    }

}


// @TODO add the other versions

/** Specification v1.4 */
export const Spec1_4: Protocol = Object.freeze(new Spec(
    Version.v1_4,
    [
        Format.XML,
        Format.JSON,
    ],
    [
        ComponentType.Application,
        ComponentType.Framework,
        ComponentType.Library,
        ComponentType.Container,
        ComponentType.OperatingSystem,
        ComponentType.Device,
        ComponentType.Firmware,
        ComponentType.File,
    ],
    [
        HashAlgorithm.MD5,
        HashAlgorithm["SHA-1"],
        HashAlgorithm["SHA-256"],
        HashAlgorithm["SHA-384"],
        HashAlgorithm["SHA-512"],
        HashAlgorithm["SHA3-256"],
        HashAlgorithm["SHA3-384"],
        HashAlgorithm["SHA3-512"],
        HashAlgorithm["BLAKE2b-256"],
        HashAlgorithm["BLAKE2b-384"],
        HashAlgorithm["BLAKE2b-512"],
        HashAlgorithm.BLAKE3,
    ],
    [
        ExternalReferenceType.VCS,
        ExternalReferenceType.IssueTracker,
        ExternalReferenceType.Website,
        ExternalReferenceType.Advisories,
        ExternalReferenceType.BOM,
        ExternalReferenceType.MailingList,
        ExternalReferenceType.Social,
        ExternalReferenceType.Chat,
        ExternalReferenceType.Documentation,
        ExternalReferenceType.Support,
        ExternalReferenceType.Distribution,
        ExternalReferenceType.License,
        ExternalReferenceType.BuildMeta,
        ExternalReferenceType.BuildSystem,
        ExternalReferenceType.ReleaseNotes,
        ExternalReferenceType.Other,
    ]
))
