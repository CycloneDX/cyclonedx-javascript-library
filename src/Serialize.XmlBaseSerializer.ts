import { Format, UnsupportedFormatError } from './Spec'
import { Factory as NormalizerFactory } from './Serialize.XML.Normalize'
import { SimpleXml } from './Serialize.XML.Types'
import { BaseSerializer } from './Serialize.BaseSerializer'
import { Bom } from './Models.Bom'
import { NormalizerOptions } from './Serialize.Types'

/**
 * Base XML serializer.
 */
export abstract class XmlBaseSerializer extends BaseSerializer<SimpleXml.Element> {
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

  protected _normalize (
    bom: Bom,
    { sortLists = false }: NormalizerOptions = {}
  ): SimpleXml.Element {
    return this.#normalizerFactory.makeForBom()
      .normalize(bom, { sortLists })
  }
}
