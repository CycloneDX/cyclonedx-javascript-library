// @ts-ignore this works as long as the paths are available in dist dir
import {enum as _spdxSpecEnum} from "../res/spdx.SNAPSHOT.schema.json"

export type SpdxId = string

const spdxIds: ReadonlySet<SpdxId> = new Set(_spdxSpecEnum)

const spdxLowerToActual: ReadonlyMap<string, SpdxId> = new Map(
    _spdxSpecEnum.map(spdxId => [spdxId.toLowerCase(), spdxId])
)

export function isSupportedSpdxId(value: SpdxId | any): value is SpdxId {
    return spdxIds.has(value)
}

/** Try to convert a string to `SpdxId`. */
export function fixupSpdxId(value: string | any): SpdxId | undefined {
    return typeof value === 'string'
        ? spdxLowerToActual.get(value.toLowerCase())
        : undefined
}

