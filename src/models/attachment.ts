import { AttachmentEncoding } from '../enums'

export class Attachment {
  contentType: string | null = null
  content: string
  encoding: AttachmentEncoding | null = null

  constructor (content: string) {
    this.content = content
  }

  compare (other: Attachment): number {
    /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- run compares in weighted order */
    return (this.contentType ?? '').localeCompare(other.contentType ?? '') ||
      this.content.localeCompare(other.content) // do not care for encoding, as long as a deterministic order is made
  }
}
