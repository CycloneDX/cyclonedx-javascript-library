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

import { treeIteratorSymbol } from '../_helpers/tree'
import type { Bom, BomRef } from '../models'
import { BomRefDiscriminator } from './bomRefDiscriminator'
import type { NormalizerOptions, Serializer, SerializerOptions } from './types'

export abstract class BaseSerializer<NormalizedBom> implements Serializer {
  * #getAllBomRefs (bom: Bom): Generator<BomRef> {
    // region from components
    if (bom.metadata.component !== undefined) {
      yield bom.metadata.component.bomRef
      for (const { bomRef } of bom.metadata.component.components[treeIteratorSymbol]()) {
        yield bomRef
      }
    }
    for (const { bomRef } of bom.components[treeIteratorSymbol]()) {
      yield bomRef
    }
    // endregion from components

    // region from services
    for (const { bomRef } of bom.services[treeIteratorSymbol]()) {
      yield bomRef
    }
    // endregion from services

    // region from vulnerabilities
    for (const { bomRef } of bom.vulnerabilities) {
      yield bomRef
    }
    // endregion from vulnerabilities
  }

  /**
   * @throws {@link Error}
   */
  #normalize (bom: Bom, options?: NormalizerOptions): NormalizedBom {
    const bomRefDiscriminator = new BomRefDiscriminator(this.#getAllBomRefs(bom))
    bomRefDiscriminator.discriminate()
    // This IS NOT the place to put meaning to the BomRef values. This would be out of scope.
    // This IS the place to make BomRef values (temporary) unique in their own document scope.
    try {
      return this._normalize(bom, options)
    } finally {
      bomRefDiscriminator.reset()
    }
  }

  public serialize (bom: Bom, options?: SerializerOptions & NormalizerOptions): string {
    return this._serialize(
      this.#normalize(bom, options),
      options
    )
  }

  /**
   * @throws {@link Error}
   */
  protected abstract _normalize (bom: Bom, options?: NormalizerOptions): NormalizedBom

  /**
   * @throws {@link Error}
   */
  protected abstract _serialize (normalizedBom: NormalizedBom, options?: SerializerOptions): string
}
