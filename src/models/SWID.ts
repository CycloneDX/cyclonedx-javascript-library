import {Attachment} from "./Attachment";

export class SWID {
    tagId: string
    name: string
    version?: string
    _tagVersion?: number
    patch?: boolean
    text?: Attachment
    url?: URL

    constructor(tagId: string, name: string) {
        this.tagId = tagId
        this.name = name
    }

    /** @type {(number|undefined)} positive integer */
    get tagVersion(): number | undefined {
        return this._tagVersion
    }

    /** @param {(number|undefined)} value positive integer */
    set tagVersion(value: number | undefined) {
        let asInt = Number.parseInt(`${value}`)
        if (asInt != value) {
            throw TypeError(`${value} is not integer`)
        }
        if (asInt < 1) {
            throw RangeError(`${asInt} must be >= 1`)
        }
        this._tagVersion = asInt
    }
}