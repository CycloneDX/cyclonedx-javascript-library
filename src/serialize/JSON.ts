import { Bom } from '../models'
import { Version as SpecVersion, Format, UnsupportedFormatError } from '../spec'
import { Serializer as SerializerProtocol } from './types'
import { Factory as NormalizerFactory } from './JSON.normalize'

const JsonSchemaUrl: ReadonlyMap<SpecVersion, string> = new Map([
  [SpecVersion.v1dot2, 'http://cyclonedx.org/schema/bom-1.2b.schema.json'],
  [SpecVersion.v1dot3, 'http://cyclonedx.org/schema/bom-1.3a.schema.json'],
  [SpecVersion.v1dot4, 'http://cyclonedx.org/schema/bom-1.4.schema.json']
])

export class Serializer implements SerializerProtocol {
  #normalizerFactory: NormalizerFactory

  /**
   * @throws {UnsupportedFormatError} if spec does not support JSON format.
   */
  constructor (normalizerFactory: NormalizerFactory) {
    if (!normalizerFactory.spec.supportsFormat(Format.JSON)) {
      throw new UnsupportedFormatError('Spec does not support JSON format.')
    }
    this.#normalizerFactory = normalizerFactory
  }

  serialize (bom: Bom): string {
    // @TODO bom-refs values make unique ...
    return JSON.stringify(
      {
        $schema: JsonSchemaUrl.get(this.#normalizerFactory.spec.version),
        ...this.#normalizerFactory.makeForBom().normalize(bom)
      },
      null,
      4
    )
  }
}

export * as Normalize from './JSON.normalize'
