import {Attachment} from "./Attachment";
import {isPositiveInteger, PositiveInteger} from "../types"

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

    #tagVersion: PositiveInteger | null = null
    get tagVersion(): PositiveInteger | null {
        return this.#tagVersion
    }
    set tagVersion(value: PositiveInteger | null) {
        if (value !== null && !isPositiveInteger(value)) {
            throw new TypeError(`${value} is not PositiveInteger nor null`)
        }
        this.#tagVersion = value
    }

}
