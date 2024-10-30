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

import {readdirSync} from "fs";
import {join, relative, resolve} from "path";

import type * as Factories from "../factories/index.node";
import {NamedLicense} from "../models/license";



/**
 * Node-specific LicenseEvidenceBuilder.
 */
export class LicenseEvidenceBuilder {

  readonly #attachmentFactory: Factories.FromPath.AttachmentFactory

  constructor(attachmentFactory: LicenseEvidenceBuilder['attachmentFactory']) {
    this.#attachmentFactory = attachmentFactory
  }

  get attachmentFactory (): Factories.FromPath.AttachmentFactory {
    return this.#attachmentFactory
  }

  /**
   * Return a license on success.
   * Returns undefined if it appears to bes no known text file.
   * Throws error, if license attachment content could not be fetched.
   *
   * @param file - path to file
   * @param relativeFrom - path the file shall be relative from
   */
  public fromFile(file: string, relativeFrom: string | undefined = undefined): NamedLicense | undefined {
    let name
    if ( relativeFrom === undefined) {
      name = `file: ${file}`
    } else {
      // `file` could be absolute or relative path - lets resolve it anyway
      file = resolve(relativeFrom, file)
      name = `file: ${relative(relativeFrom, file)}`
    }
    const text = this.#attachmentFactory.fromTextFile(file)
    if (text === undefined) {
      return undefined
    }
    return new NamedLicense(name, {text})
  }

  readonly #LICENSE_FILENAME_PATTERN = /^(?:UN)?LICEN[CS]E|.\.LICEN[CS]E$|^NOTICE$/i

  /**
   * Returns a generator for license evidences in a directory.
   * Throws error, if directory content could not be inspected.
   *
   * Unreadable files will be omitted.
   *
   * @param dir - path to inspect
   * @param relativeFrom - path the dir and files shall be relative from
   */
  public * fromDir(dir: string, relativeFrom: string | undefined = undefined): Generator<NamedLicense> {
    if ( relativeFrom !== undefined) {
      // `dir` could be absolute or relative path - lets resolve it anyway
      dir = resolve(relativeFrom, dir)
    }
    // may throw if `readdirSync()` fails
    const dcis = readdirSync(dir, { withFileTypes: true })
    for (const dci of dcis) {
      if (
        !dci.isFile() ||
        !this.#LICENSE_FILENAME_PATTERN.test(dci.name.toLowerCase())
      ) {
        continue
      }

      let le
      try {
        le = this.fromFile( join(dir, dci.name), relativeFrom)
      } catch (e) {
        continue
      }
      if (le !== undefined) {
        yield le
      }
    }
  }

}
