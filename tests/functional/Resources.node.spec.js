const fs = require('fs')
const assert = require('assert')
const { suite, test } = require('mocha')

const {
  Resources,
  Spec: { Version }
} = require('../../')

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
      Resources.FILES.CDX.JSON_SCHEMA[Version.v1dot2],
      Resources.FILES.CDX.JSON_SCHEMA[Version.v1dot3],
      Resources.FILES.CDX.JSON_SCHEMA[Version.v1dot4],
      Resources.FILES.CDX.JSON_STRICT_SCHEMA[Version.v1dot2],
      Resources.FILES.CDX.JSON_STRICT_SCHEMA[Version.v1dot3],
      Resources.FILES.CDX.XML_SCHEMA[Version.v1dot0],
      Resources.FILES.CDX.XML_SCHEMA[Version.v1dot1],
      Resources.FILES.CDX.XML_SCHEMA[Version.v1dot2],
      Resources.FILES.CDX.XML_SCHEMA[Version.v1dot3],
      Resources.FILES.CDX.XML_SCHEMA[Version.v1dot4],
      Resources.FILES.SPDX.JSON_SCHEMA,
      Resources.FILES.SPDX.XML_SCHEMA,
      Resources.FILES.JSF.JSON_SCHEMA
    ].forEach(expectedFile =>
      test(`${expectedFile}`, () =>
        assert.ok(fs.lstatSync(expectedFile).isFile())
      )
    )
  })
})
