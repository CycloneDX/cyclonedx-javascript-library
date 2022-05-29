import { HashRepository } from './hash'
import { ExternalReferenceRepository } from './externalReference'

export class Tool {
  vendor: string | null = null
  name: string | null = null
  version: string | null = null
  hashes = new HashRepository()
  externalReferences = new ExternalReferenceRepository()

  compare (other: Tool): number {
    /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- run compares in weighted order */
    return (this.vendor ?? '').localeCompare(other.vendor ?? '') ||
      (this.name ?? '').localeCompare(other.name ?? '') ||
      (this.version ?? '').localeCompare(other.version ?? '')
  }
}

export class ToolRepository extends Set<Tool> {
  static compareItems (a: Tool, b: Tool): number {
    return a.compare(b)
  }
}
