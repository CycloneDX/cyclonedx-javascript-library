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
 * This module tries to be as compatible as possible, it only uses basic methods that are known to be working in all FileSystem abstraction-layers.
 * In addition, we use type parameters for all `PathLike`s, so downstream users can utilize their implementations accordingly.
 *
 * @module
 */

import type { Stats } from 'node:fs'

import { guessMimeTypeForLicenseFile } from '../_helpers/mime.node'
import { AttachmentEncoding } from '../enums/attachmentEncoding'
import { Attachment } from '../models/attachment'

export interface FsUtils<P extends string> {
  readdirSync: (path: P ) => P[]
  readFileSync: (path: P) => Buffer
  statSync: (path: P) => Stats
}

export interface PathUtils<P extends string> {
  join: (...paths: P[]) => P
}

export interface FileAttachment<P extends string> {
  filePath: P
  file: P
  text: Attachment
}

const LICENSE_FILENAME_PATTERN = /^(?:UN)?LICEN[CS]E|.\.LICEN[CS]E$|^NOTICE$/i

export type ErrorReporter = (e:Error) => any

export class LicenseEvidenceGatherer<P extends string = string> {
  readonly #fs: FsUtils<P>
  readonly #path: PathUtils<P>

  /* eslint-disable tsdoc/syntax -- we want to use the dot-syntax - https://github.com/microsoft/tsdoc/issues/19 */
  /**
   * `fs` and `path` can be supplied, if any compatibility-layer or drop-in replacement is used.
   *
   * @param options.fs - If omitted, the native `node:fs` is used.
   * @param options.path - If omitted, the native `node:path` is used.
   */
  constructor (options: { fs?: FsUtils<P>, path?: PathUtils<P> } = {}) {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports -- needed */
    this.#fs = options.fs ?? require('node:fs')
    this.#path = options.path ?? require('node:path')
    /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports */
  }
  /* eslint-enable tsdoc/syntax */

  * getFileAttachments (prefixPath: P, onError: ErrorReporter = noop): Generator<FileAttachment<P>> {
    const files = this.#fs.readdirSync(prefixPath)  // may throw
    for (const file of files) {
      if (!LICENSE_FILENAME_PATTERN.test(file)) {
        continue
      }
      const filePath = this.#path.join(prefixPath, file)
      if (!this.#fs.statSync(filePath).isFile()) {
        // Ignore all directories - they are not files :-)
        // Don't follow symlinks for security reasons!
        continue
      }
      const contentType = guessMimeTypeForLicenseFile(file)
      if (contentType === undefined) {
        continue
      }
      try {
        yield { filePath, file, text: new Attachment(
            // since we cannot be sure weather the file content is text-only, or maybe binary,
              // we tend to base64 everything, regardless of the detected encoding.
            this.#fs.readFileSync(filePath) // may throw
                .toString('base64'),
            { contentType, encoding: AttachmentEncoding.Base64 }
          ) }
      } catch (cause) {
        onError(new Error(`skipped license file ${filePath}`, {cause}))
      }
    }
  }
}

/* eslint-disable-next-line @typescript-eslint/no-empty-function -- ack  */
function noop ():void {}
