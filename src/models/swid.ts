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

import type { NonNegativeInteger } from '../types/integer'
import { isNonNegativeInteger } from '../types/integer'
import type { Attachment } from './attachment'

export interface OptionalSWIDProperties {
  version?: SWID['version']
  patch?: SWID['patch']
  text?: SWID['text']
  url?: SWID['url']
  tagVersion?: SWID['tagVersion']
}

/**
 * @see {@link https://csrc.nist.gov/projects/Software-Identification-SWID | SWID spec}
 */
export class SWID {
  tagId: string
  name: string
  version?: string
  patch?: boolean
  text?: Attachment
  url?: URL | string

  /** @see {@link tagVersion} */
  #tagVersion?: NonNegativeInteger

  /**
   * @throws {@link TypeError} if `op.tagVersion` is neither {@link NonNegativeInteger} nor `undefined`
   */
  constructor (tagId: SWID['tagId'], name: SWID['name'], op: OptionalSWIDProperties = {}) {
    this.tagId = tagId
    this.name = name
    this.version = op.version
    this.patch = op.patch
    this.text = op.text
    this.url = op.url
    this.tagVersion = op.tagVersion
  }

  get tagVersion (): NonNegativeInteger | undefined {
    return this.#tagVersion
  }

  /**
   * @throws {@link TypeError} if value is neither {@link NonNegativeInteger} nor `undefined`
   */
  set tagVersion (value: NonNegativeInteger | undefined) {
    if (value !== undefined && !isNonNegativeInteger(value)) {
      throw new TypeError('Not NonNegativeInteger nor undefined')
    }
    this.#tagVersion = value
  }
}
