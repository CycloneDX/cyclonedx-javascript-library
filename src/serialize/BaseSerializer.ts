import { Bom, BomRef } from '../models'
import { BomRefDiscriminator } from './BomRefDiscriminator'
import { NormalizeOptions, SerializeOptions, Serializer } from './types'

export abstract class BaseSerializer<NormalizedBom> implements Serializer {
  serialize (bom: Bom, options?: SerializeOptions & NormalizeOptions): string {
    const bomRefDiscriminator = new BomRefDiscriminator(this.#getAllBomRefs(bom))
    bomRefDiscriminator.discriminate()
    try {
      return this._serialize(this._normalize(bom, options), options)
    } finally {
      bomRefDiscriminator.reset()
    }
  }

  #getAllBomRefs (bom: Bom): Iterable<BomRef> {
    const bomRefs = new Set<BomRef>()
    for (const c of bom.components) {
      bomRefs.add(c.bomRef)
    }
    if (bom.metadata.component !== null) {
      bomRefs.add(bom.metadata.component.bomRef)
    }
    return bomRefs.values()
  }

  /**
   * @internal
   * @private
   */
  protected abstract _serialize (normalizedBom: NormalizedBom, options?: SerializeOptions): string

  /**
   * @internal
   * @private
   */
  protected abstract _normalize (bom: Bom, options?: NormalizeOptions): NormalizedBom
}
