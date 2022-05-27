import { Bom } from '../models'
import { Format, UnsupportedFormatError } from '../spec'
import { SerializerOptions, NormalizerOptions } from './types'
import { BaseSerializer } from './BaseSerializer'
import { Factory as NormalizerFactory } from './JSON/normalize'
import { Normalized } from './JSON/types'

/**
 * Multi purpose Json serializer.
 */
export class JsonSerializer extends BaseSerializer<Normalized.Bom> {
  readonly #normalizerFactory: NormalizerFactory

  /**
   * @throws {UnsupportedFormatError} if spec does not support JSON format.
   */
  constructor (normalizerFactory: NormalizerFactory) {
    if (!normalizerFactory.spec.supportsFormat(Format.JSON)) {
      throw new UnsupportedFormatError('Spec does not support JSON format.')
    }

    super()
    this.#normalizerFactory = normalizerFactory
  }

  protected _serialize (
    bom: Normalized.Bom,
    { space }: SerializerOptions = {}
  ): string {
    return JSON.stringify(bom, null, space)
  }

  protected _normalize (
    bom: Bom,
    { sortLists }: NormalizerOptions = {}
  ): Normalized.Bom {
    return this.#normalizerFactory.makeForBom()
      .normalize(bom, { sortLists })
  }
}
