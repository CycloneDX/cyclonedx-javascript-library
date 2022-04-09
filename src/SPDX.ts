// @ts-ignore this works as long as the paths are available in dist dir
import {default as spdxSpec} from "../res/spdx.SNAPSHOT.schema.json"

const _spdxSpecEnum: Array<string> = spdxSpec.enum
const spdxIds: ReadonlySet<string> = new Set(_spdxSpecEnum)
const spdxLowerToActual: ReadonlyMap<string, string> = new Map(_spdxSpecEnum.map(
    function (spdxId: string): [string, string] {
        return [spdxId.toLowerCase(), spdxId];
    }
))

export type SpdxId = string

export function isSpdxId(value: any): value is SpdxId {
    return spdxIds.has(value)
}

export function fixupSpdxId(value: any): SpdxId | undefined {
    return typeof value === 'string'
        ? spdxLowerToActual.get(value.toLowerCase())
        : undefined
}

