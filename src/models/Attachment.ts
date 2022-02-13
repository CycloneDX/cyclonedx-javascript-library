import {AttachmentEncoding} from "../enums/AttachmentEncoding";

export class Attachment {
    contentType?: string
    content: string
    encoding?: AttachmentEncoding

    constructor(content:string) {
        this.content = content
    }
}