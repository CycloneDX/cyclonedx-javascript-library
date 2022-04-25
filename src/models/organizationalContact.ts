
export class OrganizationalContact {
  name: string | null = null
  email: string | null = null
  phone: string | null = null

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
