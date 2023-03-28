
const assert = require('assert')
const { suite, test } = require('mocha')

const { Utils : {
  BomUtility
}} = require('../../');

suite('Utils.BomUtility', () => {
  suite('randomSerialNumber()', () => {
    test('has correct format according to XSD', () => {
      const value = BomUtility.randomSerialNumber();
      assert.match(value, /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$|^\\{[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\}$/);
    });
    test('has correct format according to JSON schema', () => {
      const value = BomUtility.randomSerialNumber();
      assert.match(value, /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    })
  })
})
