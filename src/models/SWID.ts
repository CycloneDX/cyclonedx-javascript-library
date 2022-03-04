import {Attachment} from "./Attachment";

export class SWID {
    tagId: string
    name: string
    version: string | null = null
    #tagVersion: number | null = null
    patch: boolean | null = null
    text: Attachment | null = null
    url: URL | null = null

    constructor(tagId: string, name: string) {
        this.tagId = tagId
        this.name = name
    }

    /** @type {(number|null)} positive integer */
    get tagVersion(): number | null {
        return this.#tagVersion
    }

    /** @param {(number|null)} value positive integer */
    set tagVersion(value: number | null) {
        let asInt = Number.parseInt(`${value}`)
        if (asInt != value) {
            throw TypeError(`${value} is not integer`)
        }
        if (asInt < 1) {
            throw RangeError(`${asInt} must be >= 1`)
        }
        this.#tagVersion = asInt
    }
}
