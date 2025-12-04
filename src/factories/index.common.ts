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

import {LicenseFactory as _LicenseFactory} from '../contrib/license/factories'
import {PackageUrlFactory as _PackageUrlFactory} from '../contrib/packageUrl/factories'


// region deprecated re-exports

/**
 * Deprecated — Alias of {@link Contrib.License.Factories.LicenseFactory}.
 *
 * @deprecated This re-export location is deprecated.
 * Import `Contrib.License.Factories.LicenseFactory` instead.
 * The exported symbol itself is NOT deprecated - only this import path.
 */
export const LicenseFactory = _LicenseFactory
// export type LicenseFactory = typeof _LicenseFactory

/**
 * Deprecated — Alias of {@link Contrib.PackageUrl.Factories.PackageUrlFactory}.
 *
 * @deprecated This re-export location is deprecated.
 * Import `Contrib.PackageUrl.Factories.PackageUrlFactory` instead.
 * The exported symbol itself is NOT deprecated - only this import path.
 */
export const PackageUrlFactory = _PackageUrlFactory
// export type PackageUrlFactory = typeof _PackageUrlFactory

// endregion deprecated re-exports
