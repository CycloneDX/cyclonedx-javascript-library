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

import { Bom } from '../models'
import { Format, UnsupportedFormatError } from '../spec'
import { BaseSerializer } from './baseSerializer'
import { NormalizerOptions } from './types'
import { Factory as NormalizerFactory } from './xml/normalize'
import { SimpleXml } from './xml/types'

/**
 * Base XML serializer.
 */
export abstract class XmlBaseSerializer extends BaseSerializer<SimpleXml.Element> {
  readonly #normalizerFactory: NormalizerFactory

  /**
   * @throws {UnsupportedFormatError} if {@link normalizerFactory.spec} does not support {@link Format.XML}.
   */
  constructor (normalizerFactory: XmlBaseSerializer['normalizerFactory']) {
    if (!normalizerFactory.spec.supportsFormat(Format.JSON)) {
      throw new UnsupportedFormatError('Spec does not support JSON format.')
    }

    super()
    this.#normalizerFactory = normalizerFactory
  }

  get normalizerFactory (): NormalizerFactory {
    return this.#normalizerFactory
  }

  protected _normalize (
    bom: Bom,
    options: NormalizerOptions = {}
  ): SimpleXml.Element {
    return this.#normalizerFactory.makeForBom()
      .normalize(bom, options)
  }
}
