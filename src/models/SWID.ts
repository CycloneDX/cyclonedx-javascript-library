import {Attachment} from "./Attachment";
import {PositiveInteger, isPositiveInteger} from "../types"

export class SWID {
    tagId: string
    name: string
    version: string | null = null
    patch: boolean | null = null
    text: Attachment | null = null
    url: URL | null = null

    constructor(tagId: string, name: string) {
        this.tagId = tagId
        this.name = name
    }

    /** integer ur nul */
    #tagVersion: PositiveInteger | null = null
    /** @type {(PositiveInteger|null)} positive integer or null */
    get tagVersion(): PositiveInteger | null {
        return this.#tagVersion
    }
    /** @param {(PositiveInteger|null)} value positive integer or null */
    set tagVersion(value: PositiveInteger | null) {
        if (value !== null && !isPositiveInteger(value)) {
            throw new TypeError(`${value} is not PositiveInteger or null`)
        }
        this.#tagVersion = value
    }

}
