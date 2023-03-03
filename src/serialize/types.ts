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

export interface NormalizerOptions {
  /**
   * Whether to sort lists in normalization results. Sorted lists make the output reproducible.
   */
  sortLists?: boolean
}

export interface SerializerOptions {
  /**
   * Add indention in the serialization result. Indention increases readability for humans.
   */
  space?: string | number
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DesserializerOptions {}

export interface Serializer {
  /**
   * @throws {@link Error}
   */
  serialize: (bom: Bom, options?: SerializerOptions & NormalizerOptions) => string
}

export type VarType = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function' | '_array' | '_record'
export type PathPart = string | number
export type PathType = PathPart[]

export interface JSONDenormalizerWarningTypeMismatch {
  type: 'type'
  path: PathType
  value: any
  expected: VarType[]
  actual: VarType
}
export interface JSONDenormalizerWarningInvalidValue {
  type: 'value'
  path: PathType
  value: any
  message: string
}
export type JSONDenormalizerWarning = JSONDenormalizerWarningTypeMismatch | JSONDenormalizerWarningInvalidValue

export interface JSONDenormalizerOptions {
  /**
   * is called when a known property with an invalid type is encountered.
   * default warningFunc will throw an exception
   */
  warningFunc?: (warning: JSONDenormalizerWarning) => void
}
