import {HashRepository} from "./Hash";

export class Tool {
    vendor?: string
    name?: string
    version?: string
    hashes = new HashRepository()
}

export class ToolRepository extends Set<Tool> {
}