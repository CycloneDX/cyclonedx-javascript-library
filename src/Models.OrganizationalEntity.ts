import { OrganizationalContactRepository } from './Models.OrganizationalContact'

export class OrganizationalEntity {
  name: string | null = null
  url = new Set<URL | string>()
  contact = new OrganizationalContactRepository()
}
