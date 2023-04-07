import {Version} from "../../spec"
import {ValidationError} from "../errors";
import lax  from './_generated/json'
import strict  from './_generated/json-strict'


/**
 * @throws {@link RangeError} if version is unknown
 * @throws {@link ValidationError} on validation error
 */
export function validateLax(version: Version, data: any): void {
  const validate = lax[version]
  if (!validate) { throw new RangeError(`unknown version: ${version}`) }
  if (!validate(data)) { throw new ValidationError('validation error', validate.errors) }
}

export function validateStrict(version: Version, data: any): void {
  const validate = strict[version]
  if (!validate) { throw new RangeError(`unknown version: ${version}`) }
  if (!validate(data)) { throw new ValidationError('validation error', validate.errors) }
}
