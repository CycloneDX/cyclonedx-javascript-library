import { AttachmentEncoding } from '../enums'

interface OptionalProperties {
  contentType?: Attachment['contentType']
  encoding?: Attachment['encoding']
}

export class Attachment {
  contentType?: string
  content: string
  encoding?: AttachmentEncoding

  constructor (content: string, op: OptionalProperties = {}) {
    this.contentType = op.contentType
    this.content = content
    this.encoding = op.encoding
  }
}
