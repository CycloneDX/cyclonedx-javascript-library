import { AttachmentEncoding } from './Enums.AttachmentEncoding'

export class Attachment {
  contentType: string | null = null
  content: string
  encoding: AttachmentEncoding | null = null

  constructor (content: string) {
    this.content = content
  }
}
