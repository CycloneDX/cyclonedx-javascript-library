'use strict'
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const fs = require('fs')
const assert = require('assert')
const { suite, test } = require('mocha')

const {
  _Resources: Resources,
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
