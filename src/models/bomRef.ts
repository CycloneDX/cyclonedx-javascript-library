export class BomRef {
  value: string | null = null

  compare (other: BomRef): number {
    return (this.value ?? '').localeCompare(other.value ?? '')
  }
}

export class BomRefRepository extends Set<BomRef> {
  static compareItems (a: BomRef, b: BomRef): number {
    return a.compare(b)
  }
}
