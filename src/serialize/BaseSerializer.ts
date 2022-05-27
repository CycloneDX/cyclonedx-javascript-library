import { Bom, BomRef } from '../models'
import { BomRefDiscriminator } from './BomRefDiscriminator'
import { NormalizerOptions, SerializerOptions, Serializer } from './types'

export abstract class BaseSerializer<NormalizedBom> implements Serializer {
  serialize (bom: Bom, options?: SerializerOptions & NormalizerOptions): string {
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

  protected abstract _serialize (normalizedBom: NormalizedBom, options?: SerializerOptions): string

  protected abstract _normalize (bom: Bom, options?: NormalizerOptions): NormalizedBom
}
