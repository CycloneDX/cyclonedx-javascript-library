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

import {getMimeTypeForTextFile} from "../_helpers/mime";
import {AttachmentEncoding} from "../enums/attachmentEncoding";
import {Attachment} from "../models/attachment";
import type {MimeType} from "../types/mimeType";



/**
 * Node-specific AttachmentFactory.
 */
export class AttachmentFactory {

  /**
   * Throws error, if file content could not be read.
   *
   * Content will be base64 encoded.
   */
  public fromFile(file: string, contentType: MimeType | undefined = undefined): Attachment {
    return new Attachment(
          // may throw if `readFileSync()` fails
          readFileSync(file, {encoding: 'base64'}),
          {
            contentType,
            encoding: AttachmentEncoding.Base64
          })
  }

  /**
   * Return an attachment on success.
   * Returns undefined if it appears to be no known text file.
   * Throws error, if content could not be fetched.
   *
   * Tries to guess the file's mime-type.
   */
  public fromTextFile(file: string): Attachment | undefined {
    const contentType = getMimeTypeForTextFile(file)
    if (contentType === undefined) {
      return undefined
    }
    return this.fromFile(file, contentType)
  }

}
