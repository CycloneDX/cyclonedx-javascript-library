import { Bom } from '../models'

export interface Protocol {
  serialize: (bom: Bom) => string
}
