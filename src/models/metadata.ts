import { Component } from './component'
import { ToolRepository } from './tool'
import { OrganizationalEntity } from './organizationalEntity'
import { OrganizationalContactRepository } from './organizationalContact'

interface OptionalProperties {
  timestamp?: Metadata['timestamp']
  tools?: Metadata['tools']
  authors?: Metadata['authors']
  component?: Metadata['component']
  manufacture?: Metadata['manufacture']
  supplier?: Metadata['supplier']
}

export class Metadata {
  timestamp?: Date
  tools: ToolRepository
  authors: OrganizationalContactRepository
  component?: Component
  manufacture?: OrganizationalEntity
  supplier?: OrganizationalEntity

  constructor (op: OptionalProperties = {}) {
    this.timestamp = op.timestamp
    this.tools = op.tools ?? new ToolRepository()
    this.authors = op.authors ?? new OrganizationalContactRepository()
    this.component = op.component
    this.manufacture = op.manufacture
    this.supplier = op.supplier
  }
}
