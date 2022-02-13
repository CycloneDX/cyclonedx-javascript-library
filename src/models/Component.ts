import {ComponentType} from "../enums/ComponentType";
import {BomRef} from "./BomRef";
import {HashRepository} from "./Hash";
import {OrganizationalEntity} from "./OrganizationalEntity";
import {ExternalReferenceRepository} from "./ExternalReference";
import {LicenseRepository} from "./License";
import {ComponentScope} from "../enums/ComponentScope";
import {PackageURL} from 'packageurl-js';
import {SWID} from "./SWID";

export class Component {
    readonly bomRef = new BomRef()
    type: ComponentType
    name: string

    author?: string
    copyright?: string
    cpe?: string
    description?: string
    externalReferences = new ExternalReferenceRepository() // TODO
    group?: string
    hashes = new HashRepository()
    licenses = new LicenseRepository()
    publisher?: string
    purl?: PackageURL
    scope?: ComponentScope
    supplier?: OrganizationalEntity
    swid?: SWID
    version?: string


    constructor(type: ComponentType, name: string) {
        this.type = type
        this.name = name
    }
}

export class ComponentRepository extends Set<Component> {
}