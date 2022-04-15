import { Component } from './component'
import { ToolRepository } from './tool'
import { OrganizationalEntity } from './organizationalEntity'
import { OrganizationalContactRepository } from './organizationalContact'

export class Metadata {
  timestamp: Date | null = null
  tools = new ToolRepository()
  authors = new OrganizationalContactRepository()
  component: Component | null = null
  manufacture: OrganizationalEntity | null = null
  supplier: OrganizationalEntity | null = null
}
