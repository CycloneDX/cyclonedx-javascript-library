/**
 * Defines a string representation of a UUID conforming to RFC 4122.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc4122}
 */
export type UrnUuid = string

const urnUuidPattern = /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

export function isUrnUuid (value: any): value is UrnUuid {
  return typeof value === 'string' &&
       urnUuidPattern.test(value)
}
