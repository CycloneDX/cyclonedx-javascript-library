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

/**
 * Node-specifics.
 */

import {readFileSync} from "fs";

import {getMimeForTextFile, MimeType} from "../_helpers/mime";
import {AttachmentEncoding} from "../enums/attachmentEncoding";
import {Attachment} from "../models/attachment";



/**
 * Node-specific AttachmentFactory.
 */
export class AttachmentFactory {

  public fromFile(file: string, contentType: MimeType): Attachment {
    return new Attachment(
          // may throw if `readFileSync()` fails
          readFileSync(file).toString('base64'),
          {
            contentType,
            encoding: AttachmentEncoding.Base64
          })
  }

  public fromTextFile(file: string): Attachment | undefined {
    const contentType = getMimeForTextFile(file)
    if (contentType === undefined) {
      return undefined
    }
    return this.fromFile(file, contentType)
  }

}
