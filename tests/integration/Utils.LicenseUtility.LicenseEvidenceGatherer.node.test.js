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

const assert = require('node:assert')
const { sep } = require('node:path')

const { memfs } = require('memfs')
const { suite, test } = require('mocha')

const {
  Models: { Attachment },
  Enums: { AttachmentEncoding },
  Contrib,
} = require('../../')

suite('integration: Utils.LicenseUtility.LicenseEvidenceGatherer', () => {
  test('no path -> throws', () => {
    const { fs } = memfs({ '/': {} })
    const leg = new Contrib.License.Utils.LicenseEvidenceGatherer({ fs })
    assert.throws(
      () => {
        Array.from(
          leg.getFileAttachments('/foo'))
      },
      {
        code: 'ENOENT',
        message: "ENOENT: no such file or directory, scandir '/foo'",
        path: '/foo',
      }
    )
  })

  test('no files', () => {
    const { fs } = memfs({ '/': {} })
    const leg = new Contrib.License.Utils.LicenseEvidenceGatherer({ fs })
    const errors = []
    const found = Array.from(
      leg.getFileAttachments(
        '/',
        (e) => { errors.push(e) }
      ))
    assert.deepEqual(found, [])
    assert.deepEqual(errors, [])
  })

  test('ignore LICENSE folder', () => {
    const { fs } = memfs({
      LICENSE: {
        'MIT.txt': 'MIT License text here...',
        'GPL-3.0-or-later.txt': 'GPL-3.0-or-later License text here...'
      }
    })
    const leg = new Contrib.License.Utils.LicenseEvidenceGatherer({ fs })
    const found = Array.from(
      leg.getFileAttachments('/'))
    assert.deepEqual(found, [])
  })

  test('ignore LICENSES folder', () => {
    // see https://reuse-standard.org/
    const { fs } = memfs({
      LICENSES: {
        'MIT.txt': 'MIT License text here...',
        'GPL-3.0-or-later.txt': 'GPL-3.0-or-later License text here...'
      }
    })
    const leg = new Contrib.License.Utils.LicenseEvidenceGatherer({ fs })
    const found = Array.from(
      leg.getFileAttachments('/'))
    assert.deepEqual(found, [])
  })

  test('reports unreadable files', () => {
    // see https://reuse-standard.org/
    const { fs } = memfs({ '/LICENSE': 'license text here...' })
    const expectedError = new Error(
      `skipped license file ${sep}LICENSE`,
      { cause: new Error('Custom read error: Access denied!') })
    fs.readFileSync = function () { throw expectedError.cause }
    const leg = new Contrib.License.Utils.LicenseEvidenceGatherer({ fs })
    const errors = []
    const found = Array.from(
      leg.getFileAttachments(
        '/',
        (e) => { errors.push(e) }
      ))
    assert.deepEqual(found, [])
    assert.deepEqual(errors, [expectedError])
  })

  const mockedLicenses = Object.freeze({
    LICENSE: 'LICENSE file expected',
    LICENCE: 'LICENCE file expected',
    UNLICENSE: 'UNLICENSE file expected',
    NOTICE: 'NOTICE file expected',
    '---some-.licenses-below': 'unexpected file',
    'MIT.license': 'MIT.license file expected',
    'MIT.licence': 'MIT.licence file expected',
    '---some-licenses.-below': 'unexpected file',
    'license.mit': 'license.mit file expected',
    'license.txt': 'license.txt file expected',
    'license.js': 'license.js file unexpected',
    'license.foo': 'license.foo file unexpected',
  })

  /* eslint-disable jsdoc/valid-types -- eslint/jsdoc does not jet known import syntax */
  /**
   * @param {import('../../').Utils.LicenseUtility.FileAttachment} a
   * @param {import('../../').Utils.LicenseUtility.FileAttachment} b
   * @return {number}
   */
  function orderByFilePath (a, b) {
    return a.filePath.localeCompare(b.filePath)
  }
  /* eslint-enable jsdoc/valid-types */

  test('finds licenses as expected', () => {
    const { fs } = memfs({ '/': mockedLicenses })
    const leg = new Contrib.License.Utils.LicenseEvidenceGatherer({ fs })
    const errors = []
    const found = Array.from(
      leg.getFileAttachments(
        '/',
        (e) => { errors.push(e) }
      ))
    assert.deepEqual(found.sort(orderByFilePath), [
      {
        filePath: `${sep}LICENSE`,
        file: 'LICENSE',
        text: new Attachment(
          'TElDRU5TRSBmaWxlIGV4cGVjdGVk', {
            contentType: 'text/plain',
            encoding: AttachmentEncoding.Base64
          })
      },
      {
        filePath: `${sep}LICENCE`,
        file: 'LICENCE',
        text: new Attachment(
          'TElDRU5DRSBmaWxlIGV4cGVjdGVk', {
            contentType: 'text/plain',
            encoding: AttachmentEncoding.Base64
          })
      },
      {
        filePath: `${sep}UNLICENSE`,
        file: 'UNLICENSE',
        text: new Attachment(
          'VU5MSUNFTlNFIGZpbGUgZXhwZWN0ZWQ=', {
            contentType: 'text/plain',
            encoding: AttachmentEncoding.Base64
          })
      },
      {
        filePath: `${sep}NOTICE`,
        file: 'NOTICE',
        text: new Attachment(
          'Tk9USUNFIGZpbGUgZXhwZWN0ZWQ=', {
            contentType: 'text/plain',
            encoding: AttachmentEncoding.Base64
          })
      },
      {
        filePath: `${sep}MIT.license`,
        file: 'MIT.license',
        text: new Attachment(
          'TUlULmxpY2Vuc2UgZmlsZSBleHBlY3RlZA==', {
            contentType: 'text/plain',
            encoding: AttachmentEncoding.Base64
          })
      },
      {
        filePath: `${sep}MIT.licence`,
        file: 'MIT.licence',
        text: new Attachment(
          'TUlULmxpY2VuY2UgZmlsZSBleHBlY3RlZA==', {
            contentType: 'text/plain',
            encoding: AttachmentEncoding.Base64
          })
      },
      {
        filePath: `${sep}license.mit`,
        file: 'license.mit',
        text: new Attachment(
          'bGljZW5zZS5taXQgZmlsZSBleHBlY3RlZA==', {
            contentType: 'text/plain',
            encoding: AttachmentEncoding.Base64
          })
      },
      {
        filePath: `${sep}license.txt`,
        file: 'license.txt',
        text: new Attachment(
          'bGljZW5zZS50eHQgZmlsZSBleHBlY3RlZA==', {
            contentType: 'text/plain',
            encoding: AttachmentEncoding.Base64
          })
      }
    ].sort(orderByFilePath))
    assert.deepEqual(errors, [])
  })

  test('does not find licenses in subfolder', () => {
    const { fs } = memfs({ '/foo': mockedLicenses })
    const leg = new Contrib.License.Utils.LicenseEvidenceGatherer({ fs })
    const found = Array.from(
      leg.getFileAttachments('/'))
    assert.deepEqual(found, [])
  })
})
