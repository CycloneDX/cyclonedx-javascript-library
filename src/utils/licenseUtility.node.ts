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
 * This module tries to be as compatible as possible, it only uses basic methods that are known to be working in all FileSystem abstraction-layers.
 * In addition, we use type parameters for all `PathLike`s, so downstream users can utilize their implementations accordingly.
 *
 * @module
 */

import { LicenseEvidenceGatherer as _LicenseEvidenceGatherer,
  type ErrorReporter as _ErrorReporter,
  FileAttachment as _FileAttachment,
  PathUtils as _PathUtils,
  FsUtils as _FsUtils
} from '../contrib/license/utils.node'

/**
 * Deprecated — TypeAlias of {@link Contrib.License.Utils.FsUtils}.
 *
 * @deprecated This re-export location is deprecated.
 * Import `Contrib.License.Utils.FsUtils` instead.
 * The exported symbol itself is NOT deprecated - only this import path.
 */
export interface FsUtils<P extends string> extends _FsUtils<P> {}

/**
 * Deprecated — TypeAlias of {@link Contrib.License.Utils.PathUtils}.
 *
 * @deprecated This re-export location is deprecated.
 * Import `Contrib.License.Utils.PathUtils` instead.
 * The exported symbol itself is NOT deprecated - only this import path.
 */
export interface PathUtils<P extends string> extends _PathUtils<P> {}

/**
 * Deprecated — TypeAlias of {@link Contrib.License.Utils.FileAttachment}.
 *
 * @deprecated This re-export location is deprecated.
 * Import `Contrib.License.Utils.FileAttachment` instead.
 * The exported symbol itself is NOT deprecated - only this import path.
 */
export interface FileAttachment<P extends string> extends _FileAttachment<P> {}

/**
 * Deprecated — TypeAlias of {@link Contrib.License.Utils.ErrorReporter}.
 *
 * @deprecated This re-export location is deprecated.
 * Import `Contrib.License.Utils.ErrorReporter` instead.
 * The exported symbol itself is NOT deprecated - only this import path.
 */
export type ErrorReporter = _ErrorReporter

/**
 * Deprecated — Alias of {@link Contrib.License.Utils.LicenseEvidenceGatherer}.
 *
 * @deprecated This re-export location is deprecated.
 * Import `Contrib.License.Utils.LicenseEvidenceGatherer` instead.
 * The exported symbol itself is NOT deprecated - only this import path.
 */
export class LicenseEvidenceGatherer extends _LicenseEvidenceGatherer {}
