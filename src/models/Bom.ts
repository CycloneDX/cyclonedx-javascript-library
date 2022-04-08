import {Metadata} from "./Metadata"
import {ComponentRepository} from "./Component"
import {isPositiveInteger, PositiveInteger} from "../types"

const SerialNumberRegExp = /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

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

    #serialNumber: string | null = null
    get serialNumber(): string | null {
        return this.#serialNumber
    }
    set serialNumber(value: string | null) {
        if (value !== null && !Bom.isEligibleSerialNumber(value)) {
            throw new RangeError(`${value} is no eligible SerialNumber`)
        }
        this.#serialNumber = value
    }

    private static isEligibleSerialNumber(value: string | any): boolean {
        // this method might be moved to the Spec, as the spec defines valid values in general.
        return typeof value == 'string'
            && SerialNumberRegExp.test(value)
    }
}
