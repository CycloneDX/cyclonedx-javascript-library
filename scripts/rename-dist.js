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

const { statSync, renameSync, readdirSync } = require('fs')
const { resolve } = require('path')

/**
 * @param {string} dir
 */
function replace (dir) {
  // console.log('>> ', dir)
  for (const _ of readdirSync(dir)) {
    const entry = resolve(dir, _)
    const stats = statSync(entry)
    if (stats.isDirectory()) {
      replace(entry)
    } else if (stats.isFile()) {
      if (srcExtRE.test(entry)) {
        const renamed = entry.replace(srcExtRE, `.${targetExt}`)
        renameSync(entry, renamed)
        // console.log(entry, ' -> ', renamed)
      }
    }
  }
}

const srcExt = 'js'
const dir = process.argv[2]
const targetExt = process.argv[3]

// console.log('dir', dir)
// console.log('targetExt', targetExt)

if (!dir) { process.exit(1) }
if (!targetExt) { process.exit(2) }

const srcExtRE = new RegExp(`\\.${srcExt}$`, 'i')

replace(resolve(process.cwd(), dir))
