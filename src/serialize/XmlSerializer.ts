import { stringify as xmlStringifyInBrowser } from '../helpers/simpleXml.browser'
import { BaseSerializer } from './BaseSerializer'
import { Factory as NormalizerFactory } from './XML/normalize'
import { Format, UnsupportedFormatError } from '../spec'
import { Bom } from '../models'
import { NormalizeOptions, SerializeOptions } from './types'

const serializeXml =
  // add additional optional stringifiers here...
  xmlStringifyInBrowser ??
  function () { throw new Error('No sufficient xml stringifier found.') }

export class XmlSerializer extends BaseSerializer {
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
   * @throws {Error}
   *
   * @private
   * @internal
   */
  protected _normalize (
    bom: Bom,
    {
      sortLists = false
    }: NormalizeOptions & SerializeOptions = {}
  ): string {
    return serializeXml(
      this.#normalizerFactory.makeForBom().normalize(bom, { sortLists }),
      { }
    )
  }
}
