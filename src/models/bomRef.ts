export class BomRef {
  value: string | undefined

  constructor (value?: string) {
    this.value = value
  }

  compare (other: BomRef): number {
    return (this.value ?? '').localeCompare(other.value ?? '')
  }
}

export class BomRefRepository extends Set<BomRef> {
}
