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
 * Example showcasing the deprecated symbols still work.
 * @see https://github.com/CycloneDX/cyclonedx-javascript-library/issues/1350
 */

import * as CDX from '@cyclonedx/cyclonedx-library'
// full Library is available as `CDX`, now

const dBU1 = CDX.Utils.BomUtility.randomSerialNumber()

const dNU1 = CDX.Utils.NpmjsUtility.defaultRegistryMatcher
const dNU2 = CDX.Utils.NpmjsUtility.parsePackageIntegrity('sha1-aSbRsZT7xze47tUTdW3i/Np+pAg=')

/** @type {CDX.Types.NodePackageJson} */
const dTnpj1 = {}
try { CDX.Types.isNodePackageJson(dTnpj1) } catch { /* not implemented */ }
try { CDX.Types.assertNodePackageJson(dTnpj1) } catch { /* pass */ }

const dF1 = new CDX.Factories.PackageUrlFactory('generic')
const dF2 = new CDX.Factories.LicenseFactory()

const dFnpj3 = new CDX.Factories.FromNodePackageJson.PackageUrlFactory('npm')
const dFnpj4 = new CDX.Factories.FromNodePackageJson.ExternalReferenceFactory()

const dBnpj1 = new CDX.Builders.FromNodePackageJson.ComponentBuilder(dFnpj4, dF2)
const dBnpj2 = new CDX.Builders.FromNodePackageJson.ToolBuilder(dFnpj4)
