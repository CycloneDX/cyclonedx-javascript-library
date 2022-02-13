import {HashAlgorithm} from "../enums/HashAlogorithms";

export type HashContent = string

export type Hash = [
    // order matters: it must reflect key, value of HashRepository -
    // this way a HashRepository can be constructed from multiple Hash objects.
    algorithm: HashAlgorithm,
    content: HashContent
]

export class HashRepository extends Map<HashAlgorithm, HashContent> {
}
