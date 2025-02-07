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

import spdxExpressionParse from 'spdx-expression-parse'

/* @ts-expect-error: TS6059 -- this works as long as the file/path is available in dist-package. */
import { enum as _spdxSpecEnum } from '../res/schema/spdx.SNAPSHOT.schema.json' with { type: 'json' }

/**
 * One of the known SPDX licence identifiers.
 *
 * @see {@link http://cyclonedx.org/schema/spdx | SPDX schema}
 * @see {@link isSupportedSpdxId}
 * @see {@link fixupSpdxId}
 */
export type SpdxId = string

const spdxIds: ReadonlySet<SpdxId> = new Set(_spdxSpecEnum)

const spdxLowerToActual: Readonly<Record<string, SpdxId>> = Object.freeze(Object.fromEntries(
  _spdxSpecEnum.map(spdxId => [spdxId.toLowerCase(), spdxId])
))

export function isSupportedSpdxId (value: SpdxId | any): value is SpdxId {
  /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- fix */
  return spdxIds.has(value)
}

/** Try to convert a `string`-like to a valid/known {@link SpdxId}. */
export function fixupSpdxId (value: string | any): SpdxId | undefined {
  return typeof value === 'string' && value.length > 0
    ? spdxLowerToActual[value.toLowerCase()]
    : undefined
}

export function isValidSpdxLicenseExpression (value: string | any): boolean {
  if (typeof value !== 'string') {
    return false
  }
  try {
    spdxExpressionParse(value)
  } catch (err) {
    return false
  }
  return true
}
