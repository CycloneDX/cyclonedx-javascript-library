import {OrganizationalContactRepository} from "./OrganizationalContact";

export class OrganizationalEntity {
    name: string | null = null
    url = new Set<URL>()
    contact = new OrganizationalContactRepository()
}

export class OrganizationalEntityRepository extends Set<OrganizationalEntity> {
}
