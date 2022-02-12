import {Metadata} from "./Metadata"
import {Component} from "./Component"

export class Bom {

    // bomFormat is not part of model, its a runtime information
    // specVersion is not part of model, its a runtime information

    private _version: number = 1

    /** @returns {number} positive integer */
    get version(): number {
        return this._version
    }

    /**
     * @param {number} value positive integer
     */
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

    private static __SerialNumberRegEx: RegExp = /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

    static isSerialNumber(value: string | any): boolean {
        return typeof value == 'string' &&
            Bom.__SerialNumberRegEx.test(value)
    }

    private _serialNumber: string | undefined;

    get serialNumber(): string | undefined {
        return this._serialNumber
    }

    set serialNumber(value: string | undefined) {
        if (value !== undefined && !Bom.isSerialNumber(value)) {
            throw new RangeError(`${value} is no valid SerialNumber`)
        }
        this._serialNumber = value
    }

    metadata = new Metadata()

    components = new Set<Component>()

}