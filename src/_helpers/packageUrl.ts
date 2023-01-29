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
 * Known PURL qualifier names.
 * To be used until {@link https://github.com/package-url/packageurl-js/pull/34 | PackageURL PR#34} gets merged and released,
 * and {@link https://github.com/package-url/packageurl-js/issues/35 | PackageURL Issue#35} gets sorted out.
 *
 * For the list/spec of the well-known keys,
 * see {@link https://github.com/package-url/purl-spec/blob/master/PURL-SPECIFICATION.rst#known-qualifiers-keyvalue-pairs | known qualifiers key/value-pairs}
 */
export const enum PackageUrlQualifierNames {
  DownloadURL = 'download_url',
  VcsUrl = 'vcs_url',
  Checksum = 'checksum',
}
