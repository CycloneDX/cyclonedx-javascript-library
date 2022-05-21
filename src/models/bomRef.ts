export class BomRef {
  value: string | undefined

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
