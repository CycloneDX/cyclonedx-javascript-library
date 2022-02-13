import {ExternalReferenceType} from "../enums/ExternalReferenceType";

export class ExternalReference {
    url: URL
    type: ExternalReferenceType
    comment?: string

    constructor(url: URL, type: ExternalReferenceType) {
        this.url = url
        this.type = type
    }
}

export class ExternalReferenceRepository extends Set<ExternalReference> {
}