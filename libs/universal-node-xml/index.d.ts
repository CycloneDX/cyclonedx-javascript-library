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

import { SimpleXml } from '../../src/serialize/xml/types'
import { SerializerOptions } from '../../src/serialize/types'

declare type ThrowError = () => never

declare type Stringify = (element: SimpleXml.Element, options: SerializerOptions) => string
export declare const stringify: Stringify | undefined
export declare const stringifyFallback: Stringify | ThrowError

/*
declare type Parse = (xml: string) => SimpleXml.Element
export declare const parse: Parse | undefined
export declare const parseFallback: Parse | ThrowError
*/
