export class LicenseExpression {
    value: string

    constructor(value: string) {
        this.value = value
    }
}


export class NamedLicense {
    name: string
    text?: string
    url?: URL

    constructor(name: string) {
        this.name = name
    }
}

export class SpdxLicense {
    id: string // todo spdx enum
    text?: string
    url?: URL

    constructor(id: string) {
        this.id = id
    }
}

export type LicenseChoice = NamedLicense | SpdxLicense | LicenseExpression

export class LicenseRepository extends Set<LicenseChoice> {
}