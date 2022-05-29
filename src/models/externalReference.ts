import { ExternalReferenceType } from '../enums'

interface OptionalProperties {
  comment?: ExternalReference['comment']
}

export class ExternalReference {
  url: URL | string
  type: ExternalReferenceType
  comment?: string

  constructor (url: URL | string, type: ExternalReferenceType, op: OptionalProperties = {}) {
    this.url = url
    this.type = type
    this.comment = op.comment
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
