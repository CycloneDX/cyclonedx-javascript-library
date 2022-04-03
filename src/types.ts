export declare type PositiveInteger = number

export function isPositiveInteger(value: any): value is PositiveInteger {
    return Number.isInteger(value)
        && value > 0
}
