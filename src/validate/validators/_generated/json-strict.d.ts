
/** @see {@link https://ajv.js.org/api.html#validation-errors} */
export declare interface ErrorObject {
  keyword: string
  instancePath: string
  schemaPath: string
  params: object
  propertyName?: string
  message?: string
  schema?: any
  parentSchema?: object
  data?: any
}

export declare interface Validator {
  (data:any): boolean
  errors: ErrorObject | null
}

declare const validators: { readonly [key: string]: Validator | undefined };

/** @internal */
export default validators;
