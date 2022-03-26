import {Metadata} from "./Metadata"
import {ComponentRepository} from "./Component"
import {PositiveInteger, isPositiveInteger} from "../types"

const SerialNumberRegExp = /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

export class Bom {

    // bomFormat is not part of model, it is a runtime information
    // specVersion is not part of model, it is a runtime information

    metadata = new Metadata()
    components = new ComponentRepository()

    /** positive integer */
    #version: PositiveInteger = 1
    /** @type {PositiveInteger} positive integer */
    get version(): PositiveInteger {
        return this.#version
    }
    /** @param {PositiveInteger} value positive integer */
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

    static isEligibleSerialNumber(value: string | any): boolean {
        return typeof value == 'string' &&
            SerialNumberRegExp.test(value)
    }
}
