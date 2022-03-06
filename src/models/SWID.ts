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

    /** @type {(number|null)} positive integer ur null */
    get tagVersion(): number | null {
        return this.#tagVersion
    }

    /** @param {(number|null)} value positive integer ur null */
    set tagVersion(value: number | null) {
        if (value !== null) {
            if (!Number.isInteger(value)) {
                throw new TypeError(`${value} is not integer`)
            }
            if (value < 1) {
                throw new RangeError(`${value} must be >= 1`)
            }
        }
        this.#tagVersion = value
    }

}
