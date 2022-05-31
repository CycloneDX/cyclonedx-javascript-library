import { Bom } from '../models'
import { Format, UnsupportedFormatError } from '../spec'
import { BaseSerializer } from './baseSerializer'
import { NormalizerOptions } from './types'
import { Factory as NormalizerFactory } from './xml/normalize'
import { SimpleXml } from './xml/types'

/**
 * Base XML serializer.
 */
export abstract class XmlBaseSerializer extends BaseSerializer<SimpleXml.Element> {
  readonly #normalizerFactory: NormalizerFactory

  /**
   * @throws {UnsupportedFormatError} if {@see NormalizerFactory.spec} does not support {@see Format.XML}.
   */
  constructor (normalizerFactory: NormalizerFactory) {
    if (!normalizerFactory.spec.supportsFormat(Format.JSON)) {
      throw new UnsupportedFormatError('Spec does not support JSON format.')
    }

    super()
    this.#normalizerFactory = normalizerFactory
  }

  protected _normalize (
    bom: Bom,
    options: NormalizerOptions = {}
  ): SimpleXml.Element {
    return this.#normalizerFactory.makeForBom()
      .normalize(bom, options)
  }
}
