import { Bom } from './Models.Bom'

export interface NormalizerOptions {
  /**
   * Whether to sort lists in normalization results. Sorted lists make the output reproducible.
   */
  sortLists?: boolean
}

export interface SerializerOptions {
  /**
   * Add indention in the serialization result. Indention increases readability for humans.
   */
  space?: string | number
}

export interface Serializer {
  serialize: (bom: Bom, options?: SerializerOptions & NormalizerOptions) => string
}
