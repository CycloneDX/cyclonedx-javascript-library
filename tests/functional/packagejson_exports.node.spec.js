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
const { join, dirname } = require('path')
const { readFileSync } = require('fs')

const { suite, test } = require('mocha')

const CDX = require('../../')

suite('package.json:exports', () => {
  const pjPath = join(__dirname, '..', '..', 'package.json')
  const pjExports = JSON.parse(readFileSync(pjPath)).exports

  for (const pjExport of Object.keys(pjExports)) {
    if (pjExport.startsWith('./')) {
      const pjExp = pjExport.substring(2)
      test(`can load defined: ${pjExp}`, () => {
        const resolved = require.resolve(
          `@cyclonedx/cyclonedx-library/${pjExp}`,
          { paths: [dirname(pjPath)] })
        assert.ok(resolved)
      })
    }
  }

  suite('can load defined', () => {
    for (const pjExport of Object.keys(pjExports)) {
      if (!pjExport.startsWith('./')) {
        continue
      }
      const pjExp = pjExport.substring(2)
      test(pjExp, () => {
        const resolved = require.resolve(
          `@cyclonedx/cyclonedx-library/${pjExp}`,
          { paths: [dirname(pjPath)] })
        assert.ok(resolved)
      })
    }
  })

  suite('load as expected', () => {
    for (const [cdxModName, cdxMod] of Object.entries(CDX)) {
      if (cdxModName.startsWith('_')) {
        continue
      }
      const pjExp = cdxModName.toLowerCase()
      test(pjExp, () => {
        assert.ok(Object.hasOwn(pjExports, `./${pjExp}`))
        const resolved = require(`@cyclonedx/cyclonedx-library/${pjExp}`)
        assert.ok(cdxMod === resolved)
      })
    }
  })
})
