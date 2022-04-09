// @ts-ignore this works as long as the paths are available in dist dir
import {default as _spdxSpec} from "../res/spdx.SNAPSHOT.schema.json"

export type SpdxId = string

const _spdxSpecEnum: ReadonlyArray<SpdxId> = _spdxSpec.enum

const spdxIds: ReadonlySet<SpdxId> = new Set(_spdxSpecEnum)

const spdxLowerToActual: ReadonlyMap<string, SpdxId> = new Map(
    _spdxSpecEnum.map(spdxId => [spdxId.toLowerCase(), spdxId])
)

export function isSpdxId(value: SpdxId | any): value is SpdxId {
    return spdxIds.has(value)
}

/**
 * Try to convert a string to `SpdxId`.
 */
export function fixupSpdxId(value: string | any): SpdxId | undefined {
    return typeof value === 'string'
        ? spdxLowerToActual.get(value.toLowerCase())
        : undefined
}

