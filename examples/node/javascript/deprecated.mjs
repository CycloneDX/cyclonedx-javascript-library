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

import * as fs from 'node:fs'
import * as path from 'node:path'

import * as CDX from '@cyclonedx/cyclonedx-library'
// full Library is available as `CDX`, now

const dBU1 = CDX.Utils.BomUtility.randomSerialNumber()
console.log(dBU1)

const dNU1 = CDX.Utils.NpmjsUtility.defaultRegistryMatcher.test('foo')
const dNU2 = CDX.Utils.NpmjsUtility.parsePackageIntegrity('sha1-aSbRsZT7xze47tUTdW3i/Np+pAg=')
console.log(dNU1, dNU2)

const dLU1 = new CDX.Utils.LicenseUtility.LicenseEvidenceGatherer({fs, path})
console.log(dLU1)

/** @type {CDX.Types.NodePackageJson} */
const dTnpj1 = {}
// const dTnpj2 =CDX.Types.isNodePackageJson(dTnpj1)
try { CDX.Types.assertNodePackageJson(dTnpj1) } catch { /* pass */ }
console.log(dTnpj1)

const dF1 = new CDX.Factories.PackageUrlFactory('generic')
const dF2 = new CDX.Factories.LicenseFactory()
console.log(dF1, dF2)

const dFnpj3 = new CDX.Factories.FromNodePackageJson.PackageUrlFactory('npm')
const dFnpj4  = new CDX.Factories.FromNodePackageJson.ExternalReferenceFactory()
console.log(dFnpj3, dFnpj4)

const dBnpj1 = new CDX.Builders.FromNodePackageJson.ComponentBuilder(dFnpj4, dF2)
const dBnpj2 = new CDX.Builders.FromNodePackageJson.ToolBuilder(dFnpj4)
console.log(dBnpj1, dBnpj2)
