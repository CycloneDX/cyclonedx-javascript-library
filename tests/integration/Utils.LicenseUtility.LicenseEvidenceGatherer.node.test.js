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

const assert = require('node:assert')

const { memfs } = require('memfs')
const { suite, test } = require('mocha')

const {
  Utils: { LicenseUtility: { LicenseEvidenceGatherer } }
} = require('../../')

suite('integration: Utils.LicenseUtility.LicenseEvidenceGatherer', () => {
  test('no path -> throws', () => {
    const { fs } = memfs({ '/': {} })
    const leg = new LicenseEvidenceGatherer({ fs })
    assert.throws(
      () => {
        Array.from(leg.getFileAttachments('/foo'))
      },
      {
        code: 'ENOENT',
        message: "ENOENT: no such file or directory, scandir '/foo'",
        path: '/foo',
      }
    )
  })

  test('no files', () => {
    const { fs } = memfs({ '/': {} })
    const leg = new LicenseEvidenceGatherer({ fs })
    const errors = []
    const found = Array.from(
      leg.getFileAttachments(
        '/',
        (e) => { errors.push(e) }
      ))
    assert.deepEqual(found, [])
    assert.deepEqual(errors, [])
  })
})
