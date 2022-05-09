/* eslint-disable */
/* @ts-ignore: TS6059 -- this works as long as the paths are available in dist dir */
import { enum as _spdxSpecEnum } from '../res/spdx.SNAPSHOT.schema.json'
/* eslint-enable */

/**
 * One of the known SPDX licence identifiers.
 * @see {@link http://cyclonedx.org/schema/spdx}
 * @see isSupportedSpdxId
 * @see fixupSpdxId
 */
export type SpdxId = string

const spdxIds: ReadonlySet<SpdxId> = new Set(_spdxSpecEnum)

const spdxLowerToActual: ReadonlyMap<string, SpdxId> = new Map(
  _spdxSpecEnum.map(spdxId => [spdxId.toLowerCase(), spdxId])
)

export function isSupportedSpdxId (value: SpdxId | any): value is SpdxId {
  return spdxIds.has(value)
}

/** Try to convert a string to `SpdxId`. */
export function fixupSpdxId (value: string | any): SpdxId | undefined {
  return typeof value === 'string' && value.length > 0
    ? spdxLowerToActual.get(value.toLowerCase())
    : undefined
}
