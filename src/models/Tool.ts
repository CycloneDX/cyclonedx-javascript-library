import {HashRepository} from "./Hash";

export class Tool {
    vendor: string | null = null
    name: string | null = null
    version: string | null = null
    hashes = new HashRepository()
}

export class ToolRepository extends Set<Tool> {
}
