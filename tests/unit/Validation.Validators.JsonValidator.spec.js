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
  Spec: { Version },
  Validation: { Validators: { JsonValidator } }
} = require('../../')

suite('Validation.Validators.JsonValidator', () => {
  test('1.0 throws', () => {
    assert.throws(() => {
      JsonValidator(Version.v1dot0)
    })
  })

  test('1.1 throws', () => {
    assert.throws(() => {
      JsonValidator(Version.v1dot1)
    })
  })

  test('1.2 throws', () => {
    (new JsonValidator(Version.v1dot2)).validate({})
  })

  test('1.3 throws', () => {
    (new JsonValidator(Version.v1dot3)).validate({})
  })

  test('1.4 throws', () => {
    (new JsonValidator(Version.v1dot4)).validate({})
  })
})


