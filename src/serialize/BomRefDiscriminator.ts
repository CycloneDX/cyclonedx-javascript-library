import { BomRef } from '../models'

export class BomRefDiscriminator {
  readonly #prefix = 'BomRef.'

  readonly #originalValues: ReadonlyMap<BomRef, string | undefined>

  constructor (bomRefs: Iterable<BomRef>) {
    this.#originalValues = new Map(
      Array.from(bomRefs).map(ref => [ref, ref.value])
    )
  }

  discriminate (): void {
    // @TODO bom-refs values make unique ...
    //       and find a way to create consistent hash values or something. for reproducibility.... ?
    //       see https://github.com/CycloneDX/cyclonedx-javascript-library/issues/32
  }

  reset (): void {
    // @TODO revert modified bomRefs
    //       see https://github.com/CycloneDX/cyclonedx-javascript-library/issues/32
  }
}
