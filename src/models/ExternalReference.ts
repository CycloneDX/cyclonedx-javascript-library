import {ExternalReferenceType} from "../enums/"

export class ExternalReference {
    url: URL
    type: ExternalReferenceType
    comment: string | null = null

    constructor(url: URL, type: ExternalReferenceType) {
        this.url = url
        this.type = type
    }
}

export class ExternalReferenceRepository extends Set<ExternalReference> {
}
