import {DisjunctiveLicense, License, LicenseExpression, NamedLicense, SpdxLicense} from "../models/";
import {fixupSpdxId} from "../SPDX";


export class LicenseFactory {

    public makeFromString(value: string): License {
        try {
            return this.makeExpression(value)
        } catch (Error) {
            return this.makeDisjunctive(value)
        }
    }

    /**
     * @throws {RangeError} if expression is not eligible
     */
    public makeExpression(value: string | any): LicenseExpression {
        return new LicenseExpression(`${value}`);
    }

    public makeDisjunctive(value: string): DisjunctiveLicense {
        try {
            return this.makeDisjunctiveWithId(value);
        } catch (Error) {
            return this.makeDisjunctiveWithName(value);
        }
    }

    /**
     * @throws {RangeError} if value is not supported SPDX id
     */
    public makeDisjunctiveWithId(value: string | any): SpdxLicense {
        const spdxId = fixupSpdxId(`${value}`)
        if (!spdxId) {
            throw new RangeError(`Unknown SPDX id: ${value}`)
        }

        return new SpdxLicense(spdxId)
    }

    public makeDisjunctiveWithName(value: string | any): NamedLicense {
        return new NamedLicense(`${value}`)
    }

}
