'use strict'
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
  Spec: { SpecVersionDict, Version }
} = require('../../')

suite('SpecVersionDict', () => {
  Object.entries(SpecVersionDict).forEach(([key, spec]) =>
    suite(`key: ${key}`, () => {
      test('key is well-known version', () =>
        assert.ok(Object.values(Version).includes(key))
      )
      test('spec version equals key', () =>
        assert.equal(spec.version, key)
      )
    })
  )
})
