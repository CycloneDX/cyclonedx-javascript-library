/**
 * integer
 * @see isInteger
 */
export type Integer = number | NonNegativeInteger

export function isInteger (value: any): value is Integer {
  return Number.isInteger(value)
}

/**
 * integer >= 0
 * @see isNonNegativeInteger
 */
export type NonNegativeInteger = number | PositiveInteger

export function isNonNegativeInteger (value: any): value is NonNegativeInteger {
  return isInteger(value) &&
    value >= 0
}

/**
 * integer > 0
 * @see isPositiveInteger
 */
export type PositiveInteger = number

export function isPositiveInteger (value: any): value is PositiveInteger {
  return isInteger(value) &&
        value > 0
}
