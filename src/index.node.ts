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

/* REMEMBER:
ALL non-internal exports in here have to be set as `exports` in `package.json`
*/

export * from './index.common'

// region node-specifics

export * as Builders from './builders/index.node'
export * as Factories from './factories/index.node'
export * as Serialize from './serialize/index.node'
export * as Utils from './utils/index.node'
export * as Validation from './validation/index.node'

/**
 * Internal, until the resources-module was finalized and shows any value
 *
 * @internal
 */
export * as _Resources from './resources.node'

// endregion node-specifics
