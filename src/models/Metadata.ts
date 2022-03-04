import {Component} from "./Component";
import {ToolRepository} from "./Tool"
import {OrganizationalEntity} from "./OrganizationalEntity";
import {OrganizationalContactRepository} from "./OrganizationalContact";

export class Metadata {
    timestamp: Date | null = null
    tools = new ToolRepository()
    authors = new OrganizationalContactRepository()
    component: Component | null = null
    manufacture: OrganizationalEntity | null = null
    supplier: OrganizationalEntity | null = null
}
