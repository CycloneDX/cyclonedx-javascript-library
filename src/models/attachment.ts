/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

import type { Stringable } from '../_helpers/stringable'
import type { AttachmentEncoding } from '../enums/attachmentEncoding'

export interface OptionalAttachmentProperties {
  contentType?: Attachment['contentType']
  encoding?: Attachment['encoding']
}

export class Attachment {
  contentType?: string
  content: Stringable
  encoding?: AttachmentEncoding

  constructor (content: Attachment['content'], op: OptionalAttachmentProperties = {}) {
    this.contentType = op.contentType
    this.content = content
    this.encoding = op.encoding
  }
}
