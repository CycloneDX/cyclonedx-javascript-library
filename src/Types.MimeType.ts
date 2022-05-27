/**
 * @see isMimeType
 */
export type MimeType = string

/* regular expression was taken from the CycloneDX schema definitions. */
const mimeTypePattern = /^[-+a-z0-9.]+\/[-+a-z0-9.]+$/

export function isMimeType (value: any): value is MimeType {
  return typeof value === 'string' &&
        mimeTypePattern.test(value)
}
