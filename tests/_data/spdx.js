const fs = require('fs')
const path = require('path')
const assert = require('assert')

const spdxSpecEnum = JSON.parse(fs.readFileSync(path.resolve(
  __dirname, '..', '..', 'res', 'spdx.SNAPSHOT.schema.json'
))).enum

assert.ok(spdxSpecEnum instanceof Array)
assert.notEqual(spdxSpecEnum.length, 0)
spdxSpecEnum.forEach(value => assert.strictEqual(typeof value, 'string'))

exports.spdxSpecEnum = spdxSpecEnum
