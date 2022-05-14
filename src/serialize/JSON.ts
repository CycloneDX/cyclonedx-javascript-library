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

export interface SerializerOptions {
  /**
   * Add indention in the serialization result. Indention increases readability for humans.
   */
  space?: string | number
}

export class Serializer implements SerializerProtocol {
  readonly #normalizerFactory: NormalizerFactory

  /**
   * @throws {UnsupportedFormatError} if spec does not support JSON format.
   */
  constructor (normalizerFactory: NormalizerFactory) {
    if (!normalizerFactory.spec.supportsFormat(Format.JSON)) {
      throw new UnsupportedFormatError('Spec does not support JSON format.')
    }
    this.#normalizerFactory = normalizerFactory
  }

  serialize (
    bom: Bom,
    {
      sortLists = false,
      space = 2
    }: NormalizerOptions & SerializerOptions = {}
  ): string {
    // @TODO bom-refs values make unique ...
    //       and find a way to create consistent hash values or something. for reproducibility.... ?
    //       see https://github.com/CycloneDX/cyclonedx-javascript-library/issues/32
    try {
      const _bom: JsonBom = {
        $schema: JsonSchemaUrl.get(this.#normalizerFactory.spec.version),
        ...this.#normalizerFactory.makeForBom().normalize(bom, { sortLists })
      }
      return JSON.stringify(_bom, null, space)
    } finally {
      // @TODO revert modified bomRefs
      //       see https://github.com/CycloneDX/cyclonedx-javascript-library/issues/32
    }
  }
}
