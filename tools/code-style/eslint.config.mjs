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

import plugin_simpleImportSort from 'eslint-plugin-simple-import-sort'
import plugin_header from 'eslint-plugin-header'
import plugin_editorconfig from 'eslint-plugin-editorconfig'
import config_love from 'eslint-config-love'
import globals from 'globals'
import plugin_js from '@eslint/js'
import plugin_tsdoc from 'eslint-plugin-tsdoc'
import plugin_jsdoc from 'eslint-plugin-jsdoc'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.dirname(path.dirname(__dirname))

/* eslint-disable jsdoc/valid-types */

const licenseHeaderFile = path.join(projectRoot, '.license-header.js')

/**
 * @type {import('@types/eslint').Linter.FlatConfig[]}
 * @see {@link https://eslint.org/}
 */
export default [
  {
    name: 'general',
    plugins: {
      'simple-import-sort': plugin_simpleImportSort,
      'header': plugin_header,
      'editorconfig': plugin_editorconfig,
    },
    rules: {
      ...plugin_editorconfig.configs.all.rules,
      'import/order': 'off',
      'sort-imports': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'header/header': ['error', licenseHeaderFile],
      'editorconfig/indent': 'off',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    rules: plugin_js.configs.recommended.rules,
  },
  {
    ...plugin_jsdoc.configs['flat/recommended'],
    files: ['**/*.{js,mjs,cjs}'],
  },
  {
    name: 'jsdoc-override',
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      'jsdoc': plugin_jsdoc,
    },
    settings: {
      jsdoc: {
        mode: 'jsdoc',
      },
    },
    rules: {
      'jsdoc/no-undefined-types': 'error',
      'jsdoc/check-tag-names': 0,
      'jsdoc/check-types': 'error',
      'jsdoc/require-hyphen-before-param-description': ['error', 'always'],
      'jsdoc/require-jsdoc': 0,
      'jsdoc/require-param': 0,
      'jsdoc/require-param-description': 0,
      'jsdoc/require-param-name': 'error',
      'jsdoc/require-param-type': 'error',
      'jsdoc/require-property': 0,
      'jsdoc/require-property-description': 0,
      'jsdoc/require-property-name': 'error',
      'jsdoc/require-property-type': 'error',
      'jsdoc/require-returns': 0,
      'jsdoc/require-returns-check': 'error',
      'jsdoc/require-returns-description': 0,
      'jsdoc/require-returns-type': 'error',
      'jsdoc/require-throws': 'error',
      'jsdoc/require-yields': 0,
      'jsdoc/require-yields-check': 'error',
      'jsdoc/sort-tags': 'warn',
    }
  },
  {
    ...config_love,
    files: ['**/*.ts']
  },
  {
    files: ['**/*.ts'],
    plugins: {
      'tsdoc': plugin_tsdoc,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', {
        fixStyle: 'separate-type-imports',
      }],
      '@typescript-eslint/unbound-method': ['error', {
        ignoreStatic: true,
      }],
      'tsdoc/syntax': 'error',
    },
  },
  {
    files: ['**/*!(.{node,web}).{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    files: ['**/*.node.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.node
    }
  },
  {
    files: ['**/*.web.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.browser
    }
  },
  {
    // global ignores must have nothing but a "ignores" property!
    // see https://github.com/eslint/eslint/discussions/17429#discussioncomment-6579229
    ignores: [
      '**/.idea/',
      '**/.vscode/',
      licenseHeaderFile,
    ],
  }
]

export { globals }
