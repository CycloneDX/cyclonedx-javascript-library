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

import { OptPlugError } from '../_optPlug.node/errors'
import stringify from '../_optPlug.node/xmlStringify'
import { MissingOptionalDependencyError } from './errors'
import type { SerializerOptions } from './types'
import type { SimpleXml } from './xml/types'
import { XmlBaseSerializer } from './xmlBaseSerializer'

/**
 * XML serializer for node.
 */
export class XmlSerializer extends XmlBaseSerializer {
  // maybe override  parent::serialize() and skip nonmalization and everything, in case `stringify.fails` is true

  /**
   * @throws {@link Serialize.MissingOptionalDependencyError | MissingOptionalDependencyError}
   * @throws {@link Error}
   */
  protected _serialize (
    normalizedBom: SimpleXml.Element,
    options: SerializerOptions = {}
  ): string {
    try {
      return stringify(normalizedBom, options)
    } catch (err) {
      if (err instanceof OptPlugError) {
        throw new MissingOptionalDependencyError(err.message, err)
      }
      throw err
    }
  }
}
