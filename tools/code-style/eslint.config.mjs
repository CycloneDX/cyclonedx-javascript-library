import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  {
    files: ['**/*.!{node,web}.*'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } }
  },
  {
    files: ['**/*.node.*'],
    languageOptions: {globals: {...globals.node } }
  },
  {
    files: ['**/*.web.*'],
    languageOptions: {globals: { ...globals.browser} }
  },
  {
    files: ['**/*.{test,spec}.*'],
    languageOptions: {globals: { ...globals.mocha} }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
]
