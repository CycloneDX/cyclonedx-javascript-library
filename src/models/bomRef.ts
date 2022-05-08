export class BomRef {
  value: string | null

  constructor (value: string | null = null) {
    this.value = value
  }

  compare (other: BomRef): number {
    return (this.value ?? '').localeCompare(other.value ?? '')
  }
}

export class BomRefRepository extends Set<BomRef> {
  static compareItems (a: BomRef, b: BomRef): number {
    return a.compare(b)
  }
}
