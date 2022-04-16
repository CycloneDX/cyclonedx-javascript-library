// https://eslint.org/
module.exports = {
  root: true,
  // see https://github.com/standard/ts-standard
  extends: 'standard-with-typescript',
  parserOptions: {
    project: './tsconfig.json'
  },
  ignorePatterns: [
    'dist/',
    'dist.*/',
    'node_modules/'
  ]
}
