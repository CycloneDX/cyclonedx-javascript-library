import {Metadata} from "./metadata"
import {ComponentRepository} from "./component"
import {isPositiveInteger, isUrnUuid, PositiveInteger, UrnUuid} from "../types/";


export class Bom {

    // property `bomFormat` is not part of model, it is a runtime information
    // property `specVersion` is not part of model, it is a runtime information

    metadata = new Metadata()
    components = new ComponentRepository()

    #version: PositiveInteger = 1
    get version(): PositiveInteger {
        return this.#version
    }

    set version(value: PositiveInteger) {
        if (!isPositiveInteger(value)) {
            throw new RangeError(`${value} is not PositiveInteger`)
        }
        this.#version = value
    }

    #serialNumber: UrnUuid | null = null
    /** @type {(UrnUuid|null)} */
    get serialNumber(): UrnUuid | null {
        return this.#serialNumber
    }

    set serialNumber(value: UrnUuid | null) {
        if (value !== null && !isUrnUuid(value)) {
            throw new RangeError(`${value} is not UrnUuid`)
        }
        this.#serialNumber = value
    }


}
