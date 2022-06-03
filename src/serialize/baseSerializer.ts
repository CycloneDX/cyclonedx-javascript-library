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
Copyright (c) Steve Springett. All Rights Reserved.
*/

import { Bom, BomRef } from '../models'
import { BomRefDiscriminator } from './bomRefDiscriminator'
import { NormalizerOptions, Serializer, SerializerOptions } from './types'

export abstract class BaseSerializer<NormalizedBom> implements Serializer {
  serialize (bom: Bom, options?: SerializerOptions & NormalizerOptions): string {
    const bomRefDiscriminator = new BomRefDiscriminator(this.#getAllBomRefs(bom))
    bomRefDiscriminator.discriminate()
    try {
      return this._serialize(this._normalize(bom, options), options)
    } finally {
      bomRefDiscriminator.reset()
    }
  }

  #getAllBomRefs (bom: Bom): Iterable<BomRef> {
    const bomRefs = new Set<BomRef>()
    for (const c of bom.components) {
      bomRefs.add(c.bomRef)
    }
    if (bom.metadata.component !== undefined) {
      bomRefs.add(bom.metadata.component.bomRef)
    }
    return bomRefs.values()
  }

  protected abstract _serialize (normalizedBom: NormalizedBom, options?: SerializerOptions): string

  protected abstract _normalize (bom: Bom, options?: NormalizerOptions): NormalizedBom
}
