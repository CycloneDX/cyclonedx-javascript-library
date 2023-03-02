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

import type { Bom } from '../models'
import { BaseDeserializer } from './baseDeserializer'
import type { Factory as DenormalizerFactory } from './json/denormalize'
import type { Normalized } from './json/types'
import type { DenormalizerOptions, DesserializerOptions } from './types'

/**
 * Multi purpose Json deserializer.
 */
export class JsonDeserializer extends BaseDeserializer<Normalized.Bom> {
  readonly #normalizerFactory: DenormalizerFactory

  /**
   * @throws {@link UnsupportedFormatError} if `normalizerFactory.spec` does not support {@link Format.JSON}.
   */
  constructor (normalizerFactory: JsonDeserializer['normalizerFactory']) {
    super()
    this.#normalizerFactory = normalizerFactory
  }

  get normalizerFactory (): DenormalizerFactory {
    return this.#normalizerFactory
  }

  protected _denormalize (
    data: any,
    options: DenormalizerOptions = {}
  ): Bom {
    return this.#normalizerFactory.makeForBom()
      .denormalize(data, options)
  }

  protected _deserialize (
    str: string,
    opts: DesserializerOptions = {}
  ): Normalized.Bom {
    return JSON.parse(str)
  }
}
