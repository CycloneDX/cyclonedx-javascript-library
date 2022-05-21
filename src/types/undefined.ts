
export type NotUndefined<T> = T extends undefined ? never : T

export function isNotUndefined<T> (value: T | undefined): value is NotUndefined<T> {
  return value !== undefined
}
