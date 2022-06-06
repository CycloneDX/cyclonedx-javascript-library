import { SimpleXml } from '../../src/serialize/xml/types'
import { SerializerOptions } from '../../src/serialize/types'

declare type Stringify = (d: SimpleXml.Element, o: SerializerOptions) => string

export declare const stringify: Stringify | undefined

export declare const stringifiers: Readonly<{
  xmlbuilder2?: Stringify | undefined
}>

