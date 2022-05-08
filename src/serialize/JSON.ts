import { Bom } from '../models'
import { Version as SpecVersion, Format, UnsupportedFormatError } from '../spec'
import { Serializer as SerializerProtocol } from './types'
import { Factory as NormalizerFactory, Options as NormalizerOptions } from './JSON.normalize'
import { Bom as JsonBom } from './JSON.types'

export * as Normalize from './JSON.normalize'
export * as Types from './JSON.types'

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

  serialize (bom: Bom, options: NormalizerOptions = {}): string {
    // @TODO bom-refs values make unique ... - and find a way to create consistent hash values or something. for reproducibility.... ?
    try {
      const _bom: JsonBom = {
        $schema: JsonSchemaUrl.get(this.#normalizerFactory.spec.version),
        ...this.#normalizerFactory.makeForBom().normalize(bom, options)
      }
      return JSON.stringify(_bom, null, 2)
    } finally {
      // @TODO revert modified bomRefs
    }
  }
}
