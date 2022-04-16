// mocha config
// read: https://mochajs.org/#configuring-mocha-nodejs
module.exports = {
  recursive: true,
  extension: [
    'spec.js', 'test.js',
    'spec.cjs', 'test.cjs',
    'spec.mjs', 'test.mjs',
  ],
  ui: 'tdd',
}
