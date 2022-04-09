import {ComponentType, ExternalReferenceType, HashAlgorithm} from "./enums/";


export enum Version {
    v1_4 = '1.4',
    v1_3 = '1.3',
    v1_2 = '1.2',
    v1_1 = '1.1',
    v1_0 = '1.0',
}


export interface Protocol {
    readonly version: Version

    supportsComponentType(ct: any): boolean;

    supportsHashAlgorithm(ha: any): boolean;

    supportsExternalReferenceType(ert: any): boolean;
}

class Spec implements Protocol {

    #version: Version
    #supportedComponentTypes: ReadonlySet<ComponentType>
    #supportedHashAlgorithms: ReadonlySet<HashAlgorithm>
    #supportedExternalReferenceTypes: ReadonlySet<ExternalReferenceType>

    constructor(
        version: Version,
        supportedComponentTypes: Iterable<ComponentType>,
        supportedHashAlgorithms: Iterable<HashAlgorithm>,
        supportedExternalReferenceTypes: Iterable<ExternalReferenceType>
    ) {
        this.#version = version
        this.#supportedComponentTypes = new Set(supportedComponentTypes)
        this.#supportedHashAlgorithms = new Set(supportedHashAlgorithms)
        this.#supportedExternalReferenceTypes = new Set(supportedExternalReferenceTypes)
    }

    get version(): Version {
        return this.#version
    }

    supportsComponentType(ct: any): boolean {
        return this.#supportedComponentTypes.has(ct)
    }

    supportsHashAlgorithm(ha: any): boolean {
        return this.#supportedHashAlgorithms.has(ha)
    }

    supportsExternalReferenceType(ert: any): boolean {
        return this.#supportedExternalReferenceTypes.has(ert)
    }

}

export const Spec1_4: Protocol = Object.freeze(new Spec(
    Version.v1_4,
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

// @TODO add the other versions
