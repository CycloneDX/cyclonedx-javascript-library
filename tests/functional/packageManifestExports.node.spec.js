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

suite('functional: packageManifest:exports', () => {
  const pjPath = join(__dirname, '..', '..', 'package.json')
  const { exports: pjExports } = JSON.parse(readFileSync(pjPath))

  suite('subpaths', () => {
    /** @type {Set<string>} */
    const pjRelExported = new Set(
      Object.keys(pjExports)
        .filter(e => e.startsWith('./'))
        .map(e => e.substring(2))
    )

    suite('can load defined', () => {
      for (const pjExport of pjRelExported) {
        test(pjExport, () => {
          const resolved = require.resolve(
            `@cyclonedx/cyclonedx-library/${pjExport}`,
            { paths: [dirname(pjPath)] })
          assert.ok(resolved)
        })
      }
    })

    suite('load submodule as expected', () => {
      for (const [cdxModName, cdxMod] of Object.entries(CDX)) {
        if (cdxModName.startsWith('_')) {
          continue // skip internal
        }
        test(cdxModName, () => {
          assert.ok(pjRelExported.has(cdxModName))
          const resolved = require(`@cyclonedx/cyclonedx-library/${cdxModName}`)
          assert.strictEqual(cdxMod, resolved)
        })
      }
    })

    suite('does not export internal sobmodules', () => {
      for (const [cdxModName, cdxMod] of Object.entries(CDX)) {
        if (!cdxModName.startsWith('_')) {
          continue // skip non-internal
        }
        test(cdxModName, () => {
          for (const pjExp of pjRelExported) {
            const resolved = require(`@cyclonedx/cyclonedx-library/${pjExp}`)
            assert.notStrictEqual(cdxMod, resolved, `exported as "${pjExp}"`)
          }
        })
      }
    })
  })
})
