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
import globals from 'globals'
import plugin_tsdoc from 'eslint-plugin-tsdoc'
import plugin_jsdoc from 'eslint-plugin-jsdoc'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})
const projectRootPath = path.dirname(path.dirname(__dirname))

export default [
  {
    ignores: [
      '**/node_modules/**/*',
      'reports/**/*',
      'q/dist/**/*',
      'dist.*/**/*',
      'docs/api/**/*',
      'docs/_build/**/*',
      'docs/.venv/**/*',
      'examples/**/dist/**/*',
      'res/schema/',
      '!src/**/*',
      'tools/**/*',
      '!tools/schema-downloader/**/*',
      '.license-header.js',
      '**/.idea/**/*',
      '**/.vscode/**/*',
    ],
  },
  ...compat.extends('plugin:editorconfig/all'),
  {
    plugins: {
      'simple-import-sort': plugin_simpleImportSort,
      'header': plugin_header,
      'editorconfig': plugin_editorconfig,
    },
    languageOptions: {
      globals: {
        ...globals.commonjs,
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'import/order': 'off',
      'sort-imports': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'header/header': [
        'error',
        path.join(__dirname, '.license-header.js'),
      ],
      'editorconfig/indent': 'off',
    },
  },
  {
    files: ['**/*.node.*'],
    languageOptions: {
      globals: {
        ...Object.fromEntries(Object.entries(globals.browser).map(([key]) => [key, 'off'])),
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.web.*'],
    languageOptions: {
      globals: {
        ...Object.fromEntries(Object.entries(globals.node).map(([key]) => [key, 'off'])),
        ...globals.browser,
      },
    },
  },
  {
    files: [
      '**/*.spec.*',
      '**/*.test.*'
    ],
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
  },
  {
    ...await import('eslint-config-love'),
    files: ['**/*.ts'],
  },
  {
    files: ['**/*.ts'],
    plugins: {
      plugin_tsdoc,
    },
    languageOptions: {
      parserOptions: {
        project: path.join(projectRootPath, 'tsconfig.json'),
      },
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
    files: ['examples/node/typescript/example.cjs/src/*.ts'],
    languageOptions: {
      parserOptions: {
        project: path.join(projectRootPath, 'examples', 'node', 'typescript', 'example.cjs', 'tsconfig.json')
      },
    },
  }, {
    files: ['examples/node/typescript/example.mjs/src/*.ts'],
    languageOptions: {
      parserOptions: {
        project: path.join(projectRootPath, 'examples', 'node', 'typescript', 'example.mjs', 'tsconfig.json'
        )
      },
    },
  },
  {
    ...plugin_jsdoc.configs['flat/recommended'],
    files: [
      '**/*.js',
      '**/*.mjs',
      '**/*.cjs'
    ],
  },
  {
    files: [
      '**/*.js',
      '**/*.mjs',
      '**/*.cjs'
    ],
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
    },
  }
]
