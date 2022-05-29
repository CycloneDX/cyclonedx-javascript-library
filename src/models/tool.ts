import { HashRepository } from './hash'
import { ExternalReferenceRepository } from './externalReference'

interface OptionalProperties {
  vendor?: Tool['vendor']
  name?: Tool['name']
  version?: Tool['version']
  hashes?: Tool['hashes']
  externalReferences?: Tool['externalReferences']
}

export class Tool {
  vendor?: string
  name?: string
  version?: string
  hashes: HashRepository
  externalReferences: ExternalReferenceRepository

  constructor (op: OptionalProperties = {}) {
    this.vendor = op.vendor
    this.name = op.name
    this.version = op.version
    this.hashes = op.hashes ?? new HashRepository()
    this.externalReferences = op.externalReferences ?? new ExternalReferenceRepository()
  }

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
