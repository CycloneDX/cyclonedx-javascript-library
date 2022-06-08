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

import { SerializerOptions } from './types'
import { XmlBaseSerializer } from './xmlBaseSerializer'
import { SimpleXml } from './xml/types'
import { stringifyFallback } from '@cyclonedx/cyclonedx-library-universal-node-xml'

/**
 * XML serializer for node.
 */
export class XmlSerializer extends XmlBaseSerializer {
  protected _serialize (
    normalizedBom: SimpleXml.Element,
    options: SerializerOptions = {}
  ): string {
    return stringifyFallback(normalizedBom, options)
  }
}
