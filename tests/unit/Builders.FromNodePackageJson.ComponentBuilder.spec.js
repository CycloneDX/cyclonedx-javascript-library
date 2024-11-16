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

const assert = require('assert')
const { suite, test } = require('mocha')

const {
  Builders: { FromNodePackageJson: { ComponentBuilder } },
  Factories: {
    FromNodePackageJson: { ExternalReferenceFactory },
    LicenseFactory
  }
} = require('../../')

suite('unit: Builders.FromNodePackageJson.ComponentBuilder', () => {
  test('construct', () => {
    const extRefFactory = new ExternalReferenceFactory()
    const licenseFactory = new LicenseFactory()

    const actual = new ComponentBuilder(extRefFactory, licenseFactory)

    assert.strictEqual(actual.extRefFactory, extRefFactory)
    assert.strictEqual(actual.licenseFactory, licenseFactory)
  })
})
