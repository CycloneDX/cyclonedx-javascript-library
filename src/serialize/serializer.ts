import {Bom} from "../models";

export interface Serializer {
    serialize(bom: Bom): string
}
