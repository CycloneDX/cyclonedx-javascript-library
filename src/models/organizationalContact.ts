interface OptionalProperties {
  name?: OrganizationalContact['name']
  email?: OrganizationalContact['email']
  phone?: OrganizationalContact['phone']
}

export class OrganizationalContact {
  name?: string
  email?: string
  phone?: string

  constructor (op: OptionalProperties = {}) {
    this.name = op.name
    this.email = op.email
    this.phone = op.phone
  }

  compare (other: OrganizationalContact): number {
    /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- run compares in weighted order */
    return (this.name ?? '').localeCompare(other.name ?? '') ||
      (this.email ?? '').localeCompare(other.email ?? '') ||
      (this.phone ?? '').localeCompare(other.phone ?? '')
  }
}

export class OrganizationalContactRepository extends Set<OrganizationalContact> {
  static compareItems (a: OrganizationalContact, b: OrganizationalContact): number {
    return a.compare(b)
  }
}
