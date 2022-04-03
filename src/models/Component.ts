import {ComponentScope, ComponentType} from "../enums/"
import {BomRef} from "./BomRef"
import {HashRepository} from "./Hash"
import {OrganizationalEntity} from "./OrganizationalEntity"
import {ExternalReferenceRepository} from "./ExternalReference"
import {LicenseRepository} from "./License"
import {PackageURL} from 'packageurl-js'
import {SWID} from "./SWID"

export class Component {
    readonly bomRef = new BomRef()
    type: ComponentType
    name: string
    author: string | null = null
    copyright: string | null = null
    cpe: string | null = null
    description: string | null = null
    externalReferences = new ExternalReferenceRepository()
    group: string | null = null
    hashes = new HashRepository()
    licenses = new LicenseRepository()
    publisher: string | null = null
    purl: PackageURL | null = null
    scope: ComponentScope | null = null
    supplier: OrganizationalEntity | null = null
    swid: SWID | null = null
    version: string | null = null

    constructor(type: ComponentType, name: string) {
        this.type = type
        this.name = name
    }
}

export class ComponentRepository extends Set<Component> {
}
