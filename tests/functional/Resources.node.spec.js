const fs = require('fs')
const assert = require('assert')
const { suite, test } = require('mocha')

const { Resources } = require('../../')

suite('Resources', () => {
  suite('expected dir', () => {
    [
      Resources.ROOT
    ].forEach(expectedDir =>
      test(`${expectedDir}`, () =>
        assert.ok(fs.lstatSync(expectedDir).isDirectory())
      )
    )
  })

  suite('expected files', () => {
    [
      Resources.FILE_CDX_JSON_SCHEMA_1_2,
      Resources.FILE_CDX_JSON_SCHEMA_1_3,
      Resources.FILE_CDX_JSON_SCHEMA_1_4,
      Resources.FILE_CDX_JSON_STRICT_SCHEMA_1_2,
      Resources.FILE_CDX_JSON_STRICT_SCHEMA_1_3,
      Resources.FILE_CDX_XML_SCHEMA_1_0,
      Resources.FILE_CDX_XML_SCHEMA_1_1,
      Resources.FILE_CDX_XML_SCHEMA_1_2,
      Resources.FILE_CDX_XML_SCHEMA_1_3,
      Resources.FILE_CDX_XML_SCHEMA_1_4,
      Resources.FILE_JSF_JSON_SCHEMA,
      Resources.FILE_SPDX_XML_SCHEMA,
      Resources.FILE_SPDX_JSON_SCHEMA
    ].forEach(expectedFile =>
      test(`${expectedFile}`, () =>
        assert.ok(fs.lstatSync(expectedFile).isFile())
      )
    )
  })
})
