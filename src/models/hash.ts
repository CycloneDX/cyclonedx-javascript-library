import { HashAlgorithm } from '../enums'

// no regex for the HashContent in here. It applies at runtime of a normalization/serialization process.
export type HashContent = string

export type Hash = readonly [
  // order matters: it must reflect [key, value] of HashRepository -
  // this way a HashRepository can be constructed from multiple Hash objects.
  algorithm: HashAlgorithm,
  content: HashContent
]

export class HashRepository extends Map<Hash[0], Hash[1]> {
  static compareItems (a: Hash, b: Hash): number {
    /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- run compares in weighted order */
    return a[0].localeCompare(b[0]) ||
      a[1].localeCompare(b[1])
  }
}
