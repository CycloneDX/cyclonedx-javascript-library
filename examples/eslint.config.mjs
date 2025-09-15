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

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import baseCfg, { globals } from '../tools/code-style/eslint.config.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/* eslint-disable jsdoc/valid-types -- type-import not supported yet */

/**
 * @type {import('../tools/code-style/node_modules/eslint').Linter.Config[]}
 * @see https://eslint.org/
 */
export default [
  ...baseCfg, ,
  {
    files: ['./**/*.{js,mjs,cjs,ts}'],
    rules: {
      'no-console': 'off'
    },
  },
  {
    files: ['./node/**/*.{js,mjs,cjs,ts}'],
    rules: {
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off'
    },
    languageOptions: {
      globals: globals.node
    }
  },
  {
    files: ['./web/*/src/**'],
    languageOptions: {
      globals: globals.browser
    }
  },
  {
    files: ['./node/typescript/example.cjs/src/*.ts'],
    languageOptions: {
      parserOptions: {
        project: path.join(__dirname, 'node', 'typescript', 'example.cjs', 'tsconfig.json')
      },
    },
  },
  {
    files: ['./node/typescript/example.mjs/src/*.ts'],
    languageOptions: {
      parserOptions: {
        project: path.join(__dirname, 'node', 'typescript', 'example.mjs', 'tsconfig.json'
        )
      },
    },
  },
  {
    // global ignores must have nothing but a "ignores" property!
    // see https://github.com/eslint/eslint/discussions/17429#discussioncomment-6579229
    ignores: [
      '**/dist/',
    ],
  },
]
