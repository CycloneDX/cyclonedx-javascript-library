import { BomRef } from '../models'

export class BomRefDiscriminator {
  readonly #prefix = 'BomRef'

  readonly #originalValues: ReadonlyMap<BomRef, string | undefined>

  constructor (bomRefs: Iterable<BomRef>) {
    this.#originalValues = new Map(
      Array.from(bomRefs).map(ref => [ref, ref.value])
    )
  }

  discriminate (): void {
    const knownRefValues = new Set<string>()
    this.#originalValues.forEach((_, bomRef) => {
      let discriminatedValue = bomRef.value
      if (discriminatedValue === undefined || knownRefValues.has(discriminatedValue)) {
        discriminatedValue = this._makeUniqueId()
        bomRef.value = discriminatedValue
      }
      knownRefValues.add(discriminatedValue)
    })
  }

  protected _makeUniqueId (): string {
    return `${
      this.#prefix
    }${
      Math.random().toString(32).substring(1)
    }${
      Math.random().toString(32).substring(1)
    }`
  }

  reset (): void {
    this.#originalValues.forEach((originalValue, bomRef) => {
      bomRef.value = originalValue
    })
  }
}
