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
      let value = bomRef.value
      if (value === undefined || knownRefValues.has(value)) {
        value = this.#makeUniqueId()
        bomRef.value = value
      }
      knownRefValues.add(value)
    })
  }

  reset (): void {
    this.#originalValues.forEach((value, bomRef) => {
      bomRef.value = value
    })
  }

  #makeUniqueId (): string {
    return `${
      this.#prefix
    }${
      Math.random().toString(32).substring(1)
    }${
      Math.random().toString(32).substring(1)
    }`
  }
}
