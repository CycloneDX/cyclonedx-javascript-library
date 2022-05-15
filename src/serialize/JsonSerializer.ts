import { Bom } from '../models'
import { Version as SpecVersion, Format, UnsupportedFormatError } from '../spec'
import { SerializeOptions, NormalizeOptions } from './types'
import { BaseSerializer } from './BaseSerializer'
import { Factory as NormalizerFactory } from './JSON/normalize'
import { Bom as JsonBom } from './JSON/types'

const SchemaUrl: ReadonlyMap<SpecVersion, string> = new Map([
  [SpecVersion.v1dot2, 'http://cyclonedx.org/schema/bom-1.2b.schema.json'],
  [SpecVersion.v1dot3, 'http://cyclonedx.org/schema/bom-1.3a.schema.json'],
  [SpecVersion.v1dot4, 'http://cyclonedx.org/schema/bom-1.4.schema.json']
])

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

  /** @internal */
  protected _normalize (
    bom: Bom,
    {
      sortLists = false,
      space = 0
    }: NormalizeOptions & SerializeOptions = {}
  ): string {
    const _bom: JsonBom = {
      $schema: SchemaUrl.get(this.#normalizerFactory.spec.version),
      ...this.#normalizerFactory.makeForBom().normalize(bom, { sortLists })
    }
    return JSON.stringify(_bom, null, space)
  }
}
