export class OrganizationalContact {
    name?: string
    email?: string
    phone?: string
}

export class OrganizationalContactRepository extends Set<OrganizationalContact> {
}