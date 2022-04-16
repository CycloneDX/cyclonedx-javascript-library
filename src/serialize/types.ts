import { Bom } from '../models'

export interface Serializer {
  serialize: (bom: Bom) => string
}

export interface Deserializer {
  deserialize: (bom: string) => Bom
}
