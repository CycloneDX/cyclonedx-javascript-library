import { Bom } from '../models'

export interface NormalizeOptions {
  /**
   * Whether to sort lists in normalization results. Sorted lists make the output reproducible.
   */
  sortLists?: boolean
}

export interface SerializeOptions {
  /**
   * Add indention in the serialization result. Indention increases readability for humans.
   */
  space?: string | number
}

export interface Serializer {
  serialize: (bom: Bom, options?: SerializeOptions & NormalizeOptions) => string
}
