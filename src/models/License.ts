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
    id: string // @TODO: have dynamic SPDX enum basec on json schema file -- use json import feature of nodejs?
    text: string | null = null
    url: URL | null = null

    constructor(id: string) {
        this.id = id
    }
}

export type LicenseChoice = NamedLicense | SpdxLicense | LicenseExpression

export class LicenseRepository extends Set<LicenseChoice> {
}
