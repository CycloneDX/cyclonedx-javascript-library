export type MimeType = string

const mimeTypePattern = /^[-+a-z0-9.]+\/[-+a-z0-9.]+$/

export function isMimeType (value: any): value is MimeType {
  return typeof value === 'string' &&
        mimeTypePattern.test(value)
}
