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
 * Describes why an optional feature cannot act.
 */
export interface Blocker {
  readonly message: string
}


/**
 * `false` if the optional feature can act;
 * otherwise, a {@link Blocker} describing why the feature is unavailable.
 */
export type Cannot = false | Readonly<Blocker>

/**
 * Contract for classes that provide optional features.
 * The class itself (not the instance) reports its availability.
 */
export interface Provider {
  readonly cannot: Cannot
}
