module.exports = {
  root: true,
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
