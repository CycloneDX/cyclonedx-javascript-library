import { Bom } from '../models'
import { Format, UnsupportedFormatError } from '../spec'
import { SerializeOptions, NormalizeOptions } from './types'
import { BaseSerializer } from './BaseSerializer'
import { Factory as NormalizerFactory } from './JSON/normalize'

export class JsonSerializer extends BaseSerializer {
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

  /**
   * @internal
   * @private
   */
  protected _normalize (
    bom: Bom,
    {
      sortLists = false,
      space = 0
    }: NormalizeOptions & SerializeOptions = {}
  ): string {
    return JSON.stringify(
      this.#normalizerFactory.makeForBom().normalize(bom, { sortLists }),
      null, space)
  }
}
