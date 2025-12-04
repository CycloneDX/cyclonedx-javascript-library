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

/**
 * Node-specifics.
 *
 * Intended to run on normalized data structures
 * based on [PackageJson spec](https://github.com/SchemaStore/schemastore/blob/master/src/schemas/json/package.json)
 * and explained by [PackageJson description](https://docs.npmjs.com/cli/v9/configuring-npm/package-json).
 * Normalization should be done downstream, for example via [`normalize-package-data`](https://www.npmjs.com/package/normalize-package-data).
 */

import {ToolBuilder as _ToolBuilder, ComponentBuilder as _ComponentBuilder} from '../contrib/fromNodePackageJson/builders'


/**
 * Deprecated — Alias of {@link Contrib.FromNodePackageJson.Builders.ToolBuilder}.
 *
 * @deprecated This re-export location is deprecated.
 * Import `Contrib.FromNodePackageJson.Builders.ToolBuilder` instead.
 * The exported symbol itself is NOT deprecated - only this import path.
 */
export class ToolBuilder extends _ToolBuilder {}

/**
 * Deprecated — Alias of {@link Contrib.FromNodePackageJson.Builders.ComponentBuilder}.
 *
 * @deprecated This re-export location is deprecated.
 * Import `Contrib.FromNodePackageJson.Builders.ComponentBuilder` instead.
 * The exported symbol itself is NOT deprecated - only this import path.
 */
export class ComponentBuilder extends _ComponentBuilder {}
