import { Component } from './Models.Component'
import { ToolRepository } from './Models.Tool'
import { OrganizationalEntity } from './Models.OrganizationalEntity'
import { OrganizationalContactRepository } from './Models.OrganizationalContact'

export class Metadata {
  timestamp: Date | null = null
  tools = new ToolRepository()
  authors = new OrganizationalContactRepository()
  component: Component | null = null
  manufacture: OrganizationalEntity | null = null
  supplier: OrganizationalEntity | null = null
}
