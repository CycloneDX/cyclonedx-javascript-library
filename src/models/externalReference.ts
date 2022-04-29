import { ExternalReferenceType } from '../enums'

export class ExternalReference {
  url: URL
  type: ExternalReferenceType
  comment: string | null = null

  constructor (url: URL, type: ExternalReferenceType) {
    this.url = url
    this.type = type
  }

  compare (other: ExternalReference): number {
    /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- run compares in weighted order */
    return this.type.localeCompare(other.type) ||
      this.url.toString().localeCompare(other.url.toString())
  }
}

export class ExternalReferenceRepository extends Set<ExternalReference> {
  static compareItems (a: ExternalReference, b: ExternalReference): number {
    return a.compare(b)
  }
}
