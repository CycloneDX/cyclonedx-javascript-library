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

    isSupportedComponentType(ct: any): boolean;

    isSupportedHashAlgorithm(ha: any): boolean;

    isSupportedExternalReferenceType(ert: any): boolean;
}


export class Spec1_4 implements Protocol {

    readonly version = Version.v1_4

    static readonly #supportedComponentTypes: ReadonlySet<ComponentType> = new Set([
        ComponentType.Application,
        ComponentType.Framework,
        ComponentType.Library,
        ComponentType.Container,
        ComponentType.OperatingSystem,
        ComponentType.Device,
        ComponentType.Firmware,
        ComponentType.File,
    ])

    isSupportedComponentType(ct: any): boolean {
        return Spec1_4.#supportedComponentTypes.has(ct)
    }


    static readonly #supportedHashAlgorithms: ReadonlySet<HashAlgorithm> = new Set([
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
    ])

    isSupportedHashAlgorithm(ha: any): boolean {
        return Spec1_4.#supportedHashAlgorithms.has(ha)
    }


    static readonly #supportedExternalReferenceTypes: ReadonlySet<ExternalReferenceType> = new Set([
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
    ])

    isSupportedExternalReferenceType(ert: any): boolean {
        return Spec1_4.#supportedExternalReferenceTypes.has(ert)
    }


}

// @TODO add the other versions
