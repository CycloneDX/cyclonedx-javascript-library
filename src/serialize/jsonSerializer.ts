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

import type { Bom } from '../models/bom'
import { Format } from '../spec/enums'
import { UnsupportedFormatError } from '../spec/errors'
import { BaseSerializer } from './baseSerializer'
import type { Factory as NormalizerFactory } from './json/normalize'
import type { Normalized } from './json/types'
import type { NormalizerOptions, SerializerOptions } from './types'

/**
 * Multi purpose Json serializer.
 */
export class JsonSerializer extends BaseSerializer<Normalized.Bom> {
  readonly #normalizerFactory: NormalizerFactory

  /**
   * @throws {@link Spec.UnsupportedFormatError | UnsupportedFormatError} if `normalizerFactory.spec` does not support {@link Format.JSON}.
   */
  constructor (normalizerFactory: JsonSerializer['normalizerFactory']) {
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
  ): Normalized.Bom {
    return this.#normalizerFactory.makeForBom()
      .normalize(bom, options)
  }

  protected _serialize (
    bom: Normalized.Bom,
    { space }: SerializerOptions = {}
  ): string {
    return JSON.stringify(bom, null, space)
  }
}
