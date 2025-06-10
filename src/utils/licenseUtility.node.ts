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

import type NATIVE_FS from 'node:fs'
import type NATIVE_PATH from "node:path";

import {getMimeForLicenseFile} from '../_helpers/mime'
import {AttachmentEncoding} from '../enums/attachmentEncoding'
import {Attachment} from '../models/attachment'


interface FsUtils {
  readdirSync: typeof NATIVE_FS.readdirSync
  readFileSync: typeof NATIVE_FS.readFileSync
  statSync: typeof NATIVE_FS.statSync
}

interface PathUtils {
  join: typeof NATIVE_PATH.join
}

export interface FetchedAttachmentResult {
  filePath: string
  file: string
  text: Attachment
}

const LICENSE_FILENAME_PATTERN = /^(?:UN)?LICEN[CS]E|.\.LICEN[CS]E$|^NOTICE$/i

type ErrorReporter = (e:Error) => any

/* eslint-disable-next-line @typescript-eslint/no-empty-function -- ack  */
function noop ():void {}

export class LicenseEvidenceFetcher {
  readonly #fs: FsUtils
  readonly #path: PathUtils

  /* eslint-disable tsdoc/syntax -- we want to use the dot-syntax - https://github.com/microsoft/tsdoc/issues/19 */
  /**
   * `fs` and `path` can be supplied, if any compatibility-layer or drop-in replacement is used.
   *
   * @param options.fs - If omitted, the native `node:fs` is used.
   * @param options.path - If omitted, the native `node:path` is used.
   */
  /* eslint-enable tsdoc/syntax */
  constructor (options: { fs?: FsUtils, path?: PathUtils } = {}) {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports -- needed */
    this.#fs = options.fs ?? require('node:fs')
    this.#path = options.path ?? require('node:path')
    /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports */
  }

  * fetchAsAttachment (prefixPath: string, onError: ErrorReporter = noop): Generator<FetchedAttachmentResult> {
    const files = this.#fs.readdirSync(prefixPath)
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
      const contentType = getMimeForLicenseFile(file)
      if (contentType === undefined) {
        continue
      }
      try {
        yield { filePath, file, text: new Attachment(
            this.#fs.readFileSync(filePath).toString('base64'),
            {
              contentType,
              encoding: AttachmentEncoding.Base64
            }
          )
        }
      }
      /* c8 ignore next 3 */
      catch (e) {
        onError(new Error(`skipped license file ${filePath}`, {cause: e}))
      }
    }
  }
}
