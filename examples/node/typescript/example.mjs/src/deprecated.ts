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
// Full Library is available as `CDX`, now.
// Alternative for better tree-shaking on bundling, import only the needed symbols like so:
//    import { Bom, Component } from '@cyclonedx/cyclonedx-library/Models'
//    import { ComponentType } from '@cyclonedx/cyclonedx-library/Enums'

const dBU1 = CDX.Utils.BomUtility.randomSerialNumber()
console.log(dBU1)

const dNU1 = CDX.Utils.NpmjsUtility.defaultRegistryMatcher.test('foo')
const dNU2 = CDX.Utils.NpmjsUtility.parsePackageIntegrity('sha1-aSbRsZT7xze47tUTdW3i/Np+pAg=')
console.log(dNU1, dNU2)

type dLU1_T = CDX.Utils.LicenseUtility.LicenseEvidenceGatherer
const fsU: CDX.Utils.LicenseUtility.FsUtils<string> = fs
const pathU: CDX.Utils.LicenseUtility.PathUtils<string> = path
const dLU1: dLU1_T = new CDX.Utils.LicenseUtility.LicenseEvidenceGatherer({fs: fsU, path: pathU})
console.log(dLU1)

const dTnpj1: CDX.Types.NodePackageJson = {}
// const dTnpj2 =CDX.Types.isNodePackageJson(dTnpj1)
try { CDX.Types.assertNodePackageJson(dTnpj1) } catch { /* pass */ }
console.log(dTnpj1)

type dF1_T = CDX.Factories.PackageUrlFactory
type dF2_T = CDX.Factories.LicenseFactory
const dF1: dF1_T = new CDX.Factories.PackageUrlFactory('generic')
const dF2: dF2_T = new CDX.Factories.LicenseFactory()
console.log(dF1, dF2)

type dFnpj3_T = CDX.Factories.FromNodePackageJson.PackageUrlFactory
const dFnpj3: dFnpj3_T = new CDX.Factories.FromNodePackageJson.PackageUrlFactory('npm')
type dFnpj4_T = CDX.Factories.FromNodePackageJson.ExternalReferenceFactory
const dFnpj4: dFnpj4_T  = new CDX.Factories.FromNodePackageJson.ExternalReferenceFactory()
console.log(dFnpj3, dFnpj4)

type dBnpj1_T = CDX.Builders.FromNodePackageJson.ComponentBuilder
const dBnpj1: dBnpj1_T = new CDX.Builders.FromNodePackageJson.ComponentBuilder(dFnpj4, dF2)
type dBnpj2_T = CDX.Builders.FromNodePackageJson.ToolBuilder
const dBnpj2: dBnpj2_T = new CDX.Builders.FromNodePackageJson.ToolBuilder(dFnpj4)
console.log(dBnpj1, dBnpj2)
