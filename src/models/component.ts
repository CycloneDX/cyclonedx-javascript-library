import {PackageURL} from 'packageurl-js'

import {ComponentScope, ComponentType} from "../enums/"
import {BomRef} from "./bomRef"
import {HashRepository} from "./hash"
import {OrganizationalEntity} from "./organizationalEntity"
import {ExternalReferenceRepository} from "./externalReference"
import {LicenseRepository} from "./license"
import {SWID} from "./SWID"
import {CPE, isCPE} from "../types/";


export class Component {
    readonly bomRef = new BomRef()
    type: ComponentType
    name: string
    author: string | null = null
    copyright: string | null = null
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

    #cpe: CPE | null = null
    /** @type {(CPE|null)} */
    get cpe(): CPE | null {
        return this.#cpe
    }

    set cpe(value: CPE | null) {
        if (value !== null && !isCPE(value)) {
            throw new RangeError(`${value} is not CPE`)
        }
        this.#cpe = value
    }

}

export class ComponentRepository extends Set<Component> {
}
