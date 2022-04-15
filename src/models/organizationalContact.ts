export class OrganizationalContact {
  name: string | null = null
  email: string | null = null
  phone: string | null = null
}

export class OrganizationalContactRepository extends Set<OrganizationalContact> {
}
