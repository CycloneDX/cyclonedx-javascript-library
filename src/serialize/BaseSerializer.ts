import { Bom, BomRef } from '../models'
import { BomRefDiscriminator } from './BomRefDiscriminator'
import { NormalizeOptions, SerializeOptions, Serializer } from './types'

export abstract class BaseSerializer implements Serializer {
  serialize (bom: Bom, options?: SerializeOptions & NormalizeOptions): string {
    const bomRefDiscriminator = new BomRefDiscriminator(this.#getAllBomRefs(bom))
    bomRefDiscriminator.discriminate()
    try {
      return this._normalize(bom, options)
    } finally {
      bomRefDiscriminator.reset()
    }
  }

  #getAllBomRefs (bom: Bom): Iterable<BomRef> {
    return [/* TODO */]
  }

  /**
   * Normalize the {@see Bom} and serialize this result.
   * @internal
   */
  protected abstract _normalize (bom: Bom, options?: SerializeOptions & NormalizeOptions): string
}
