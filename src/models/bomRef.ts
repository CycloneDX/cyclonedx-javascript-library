/**
 * Proxy for the BomRef.
 * This way a `BomRef` gets unique by the in-memory-address of the object.
 */
export class BomRef {
  value?: string

  constructor (value?: string) {
    this.value = value
  }

  compare (other: BomRef): number {
    return (this.toString()).localeCompare(other.toString())
  }

  toString (): string {
    return this.value ?? ''
  }
}

export class BomRefRepository extends Set<BomRef> {
}
