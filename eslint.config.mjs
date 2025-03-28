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

import baseCfg, { globals } from './tools/code-style/eslint.config.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/* eslint-disable jsdoc/valid-types -- type-import not supported yet */

/**
 * @type {import('./tools/code-style/node_modules/eslint').Linter.Config[]}
 * @see https://eslint.org/
 */
export default [
  ...baseCfg,
  {
    name: 'project-specific',
    rules: {
      complexity: ['error', { max: 15 }]
    }
  },
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' }
  },
  {
    files: ['{src,tests}/**/*!(.{node,web}).{js,mjs,cjs.ts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    files: [
      '**/*.{test,spec}.{js,mjs,cjs,ts}',
      'tests/**/*.{js,mjs,cjs,ts}'
    ],
    languageOptions: {
      globals: globals.mocha
    }
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: path.join(__dirname, 'tsconfig.json'),
      },
    },
  },
  {
    files: ['examples/**/*.{js,mjs,cjs,ts}'],
    rules: {
      'no-console': 'off'
    },
  },
  {
    files: ['examples/node/**/*.{js,mjs,cjs,ts}'],
    rules: {
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off'
    },
    languageOptions: {
      globals: globals.node
    }
  },
  {
    files: ['examples/web/*/src/**'],
    languageOptions: {
      globals: globals.browser
    }
  },
  {
    files: ['examples/node/typescript/example.cjs/src/*.ts'],
    languageOptions: {
      parserOptions: {
        project: path.join(__dirname, 'examples', 'node', 'typescript', 'example.cjs', 'tsconfig.json')
      },
    },
  },
  {
    files: ['examples/node/typescript/example.mjs/src/*.ts'],
    languageOptions: {
      parserOptions: {
        project: path.join(__dirname, 'examples', 'node', 'typescript', 'example.mjs', 'tsconfig.json'
        )
      },
    },
  },
  {
    // global ignores must have nothing but a "ignores" property!
    // see https://github.com/eslint/eslint/discussions/17429#discussioncomment-6579229
    ignores: [
      'reports/',
      'dist.*/',
      'docs/api/',
      'docs/_build/',
      'docs/.venv/',
      'examples/**/dist/',
      'res/schema/',
      'tools/',
    ],
  },
]
