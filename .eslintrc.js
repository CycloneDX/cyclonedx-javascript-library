/**
 * @see {@link https://eslint.org/}
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: true,
  // see https://github.com/standard/ts-standard
  extends: 'standard-with-typescript',
  parserOptions: {
    project: './tsconfig.json'
  }
}
