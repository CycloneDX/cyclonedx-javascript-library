import {SpdxId} from '../enums/SpdxId'

export class LicenseExpression {
    value: string

    constructor(value: string) {
        this.value = value
    }
}

export class NamedLicense {
    name: string
    text: string | null = null
    url: URL | null = null

    constructor(name: string) {
        this.name = name
    }
}

export class SpdxLicense {
    id: SpdxId
    text: string | null = null
    url: URL | null = null

    constructor(id: SpdxId) {
        this.id = id
    }
}

export type LicenseChoice = NamedLicense | SpdxLicense | LicenseExpression

export class LicenseRepository extends Set<LicenseChoice> {
}
