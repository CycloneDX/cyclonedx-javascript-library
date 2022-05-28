import { Bom } from '../models'
import { Format, UnsupportedFormatError } from '../spec'
import { NormalizerOptions, SerializerOptions } from './types'
import { BaseSerializer } from './baseSerializer'
import { Factory as NormalizerFactory } from './json/normalize'
import { Normalized } from './json/types'

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
    options: NormalizerOptions = {}
  ): Normalized.Bom {
    return this.#normalizerFactory.makeForBom()
      .normalize(bom, options)
  }
}
