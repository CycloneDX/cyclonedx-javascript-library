import { OrganizationalContactRepository } from './organizationalContact'

export class OrganizationalEntity {
  name: string | null = null
  url = new Set<URL | string>()
  contact = new OrganizationalContactRepository()
}
