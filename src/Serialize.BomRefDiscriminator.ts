import { BomRef } from './Models.BomRef'

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
    for (const [bomRef] of this.#originalValues) {
      let value = bomRef.value
      if (value === undefined || knownRefValues.has(value)) {
        value = this.#makeUniqueId()
        bomRef.value = value
      }
      knownRefValues.add(value)
    }
  }

  reset (): void {
    for (const [bomRef, originalValue] of this.#originalValues) {
      bomRef.value = originalValue
    }
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
