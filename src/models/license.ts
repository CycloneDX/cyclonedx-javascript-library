import {isSpdxId, SpdxId} from '../SPDX'

export class LicenseExpression {
    value: string

    constructor(value: string) {
        this.value = value
    }
}

export class NamedLicense {
    name: string
    text: string | null = null // TODO / FIXME: text is attachment
    url: URL | null = null

    constructor(name: string) {
        this.name = name
    }
}

export class SpdxLicense {
    text: string | null = null // TODO / FIXME: text is atyachment
    url: URL | null = null

    constructor(id: SpdxId) {
        this.id = id
    }

    #id!: SpdxId
    get id(): SpdxId
    {
        return this.#id
    }
    set id(value: SpdxId)
    {
        if (!isSpdxId(value)) {
            throw new RangeError(`Unknown SpdxId: ${value}`)
        }
        this.#id = value
    }

}

export type DisjunctiveLicense = NamedLicense | SpdxLicense
export type License = DisjunctiveLicense | LicenseExpression

export class LicenseRepository extends Set<License> {
}
