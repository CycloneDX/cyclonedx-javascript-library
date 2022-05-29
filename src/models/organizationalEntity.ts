import { OrganizationalContactRepository } from './organizationalContact'

interface OptionalProperties {
  name?: OrganizationalEntity['name']
  url?: OrganizationalEntity['url']
  contact?: OrganizationalEntity['contact']
}

export class OrganizationalEntity {
  name?: string
  url: Set<URL | string>
  contact: OrganizationalContactRepository

  constructor (op: OptionalProperties = {}) {
    this.name = op.name
    this.url = op.url ?? new Set()
    this.contact = op.contact ?? new OrganizationalContactRepository()
  }
}
