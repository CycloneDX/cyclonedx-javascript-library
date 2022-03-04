import {Metadata} from "./Metadata"
import {ComponentRepository} from "./Component"

const SerialNumberRegExp = /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

export class Bom {

    // bomFormat is not part of model, it is a runtime information
    // specVersion is not part of model, it is a runtime information

    #version: number = 1
    #serialNumber: string | null = null
    metadata = new Metadata()
    components = new ComponentRepository()

    /** @type {number} positive integer */
    get version(): number {
        return this.#version
    }

    /** @param {number} value positive integer */
    set version(value: number) {
        const asInt = Number.parseInt(`${value}`)
        if (asInt != value) {
            throw new TypeError(`${value} is not integer`)
        }
        if (asInt < 1) {
            throw new RangeError(`${asInt} must be >= 1`)
        }
        this.#version = asInt
    }

    get serialNumber(): string | null {
        return this.#serialNumber
    }

    set serialNumber(value: string | null) {
        if (value !== undefined && !Bom.isSerialNumber(value)) {
            throw new RangeError(`${value} is no valid SerialNumber`)
        }
        this.#serialNumber = value
    }

    static isSerialNumber(value: string | any): boolean {
        return typeof value == 'string' &&
            SerialNumberRegExp.test(value)
    }
}
