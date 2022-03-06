import {Metadata} from "./Metadata"
import {ComponentRepository} from "./Component"

const SerialNumberRegExp = /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

export class Bom {

    // bomFormat is not part of model, it is a runtime information
    // specVersion is not part of model, it is a runtime information

    metadata = new Metadata()
    components = new ComponentRepository()

    /** positive integer */
    #version: number = 1
    /** @type {number} positive integer */
    get version(): number {
        return this.#version
    }
    /** @param {number} value positive integer */
    set version(value: number) {
        if (!Number.isInteger(value)) {
            throw new TypeError(`${value} is not integer`)
        }
        if (value < 1) {
            throw new RangeError(`${value} must be >= 1`)
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
