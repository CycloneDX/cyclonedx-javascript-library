import {Metadata} from "./Metadata"
import {ComponentRepository} from "./Component"

const SerialNumberRegExp = /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

export class Bom {

    // bomFormat is not part of model, it is a runtime information
    // specVersion is not part of model, it is a runtime information

    private _version: number = 1
    private _serialNumber?: string
    metadata = new Metadata()
    components = new ComponentRepository()

    /** @type {number} positive integer */
    get version(): number {
        return this._version
    }

    /** @param {number} value positive integer */
    set version(value: number) {
        let asInt = Number.parseInt(`${value}`)
        if (asInt != value) {
            throw TypeError(`${value} is not integer`)
        }
        if (asInt < 1) {
            throw RangeError(`${asInt} must be >= 1`)
        }
        this._version = asInt
    }

    get serialNumber(): string | undefined {
        return this._serialNumber
    }

    set serialNumber(value: string | undefined) {
        if (value !== undefined && !Bom.isSerialNumber(value)) {
            throw new RangeError(`${value} is no valid SerialNumber`)
        }
        this._serialNumber = value
    }

    static isSerialNumber(value: string | any): boolean {
        return typeof value == 'string' &&
            SerialNumberRegExp.test(value)
    }
}
