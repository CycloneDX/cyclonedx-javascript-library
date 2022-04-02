const assert = require('assert');
const fs = require('fs')

const spdxSpecEnum = JSON.parse(
    fs.readFileSync(`${__dirname}/../../res/spdx.SNAPSHOT.schema.json`)
).enum
assert.ok(spdxSpecEnum instanceof Array)
assert.notEqual(spdxSpecEnum.length, 0)
spdxSpecEnum.forEach(value => assert.strictEqual(typeof value, 'string'))

module.exports = {
    spdxSpecEnum: spdxSpecEnum
}
