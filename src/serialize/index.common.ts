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

// !!! not everything is public, yet

export * from './bomRefDiscriminator'
export * from './errors'
/* eslint-disable-next-line @typescript-eslint/consistent-type-exports -- backwards-compat TS4 */
export * as Types from './types'

// region base

export * from './baseSerializer'
// export * from './baseDeserializer' // @TODO

// endregion base

// region JSON

export * as JSON from './json'
export * from './jsonSerializer'
// export * from './jsonDeserializer' // @TODO

// endregion JSON

// region XML

export * as XML from './xml'
export * from './xmlBaseSerializer'
// export * from './xmlBaseDeserializer' // @TODO

// endregion XML
