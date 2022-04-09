import {ComponentType, ExternalReferenceType, HashAlgorithm} from "../enums/";


export enum SpecVersion {
    v1_4 = '1.4',
    v1_3 = '1.3',
    v1_2 = '1.2',
    v1_1 = '1.1',
    v1_0 = '1.0',
}


export interface Protocol {
    readonly version: SpecVersion

    isSupportedComponentType(ct: any): boolean;

    isSupportedHashAlgorithm(ha: any): boolean;

    isSupportedExternalReferenceType(ert: any): boolean;
}


export class Spec1_4 implements Protocol {

    readonly version = SpecVersion.v1_4

    static readonly #supportedComponentTypes = Object.freeze([
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
        return ct in Spec1_4.#supportedComponentTypes
    }


    static readonly #supportedHashAlgorithms = Object.freeze([
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
        return ha in Spec1_4.#supportedHashAlgorithms
    }


    static readonly #supportedExternalReferenceTypes = Object.freeze([
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
        return ert in Spec1_4.#supportedExternalReferenceTypes
    }


}

// @TODO add the other versions
