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
Copyright (c) Steve Springett. All Rights Reserved.
*/

const assert = require('assert')
const { suite, test } = require('mocha')

const { getSpecEnum } = require('../_data/specLoader')
const { upperCamelCase } = require('../_helpers/stringFunctions')

const {
  Enums: { ComponentType },
  Spec: { Version, SpecVersionDict }
} = require('../../')

suite('ComponentType enum', () => {
  const schemas = new Map([
    [Version.v1dot2, 'bom-1.2.SNAPSHOT.schema.json'],
    [Version.v1dot3, 'bom-1.3.SNAPSHOT.schema.json'],
    [Version.v1dot4, 'bom-1.4.SNAPSHOT.schema.json']
  ])

  schemas.forEach((resourceFile, specVersion) =>
    suite(`from spec ${specVersion} (${resourceFile})`, () =>
      getSpecEnum(resourceFile, 'component', 'properties', 'type').forEach(enumValue => {
        const expectedName = upperCamelCase(enumValue)
        test(`is known: ${expectedName} -> ${enumValue}`, () =>
          assert.strictEqual(ComponentType[expectedName], enumValue)
        )
        test(`is supported: ${enumValue}`, () =>
          assert.ok(SpecVersionDict[specVersion]?.supportsComponentType(enumValue))
        )
      })
    )
  )
})
