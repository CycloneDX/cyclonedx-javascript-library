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

const { memfs } = require('memfs')
const { suite, test } = require('mocha')

const {
  Models: { Attachment },
  Enums: { AttachmentEncoding },
  Utils: { LicenseUtility: { LicenseEvidenceGatherer } }
} = require('../../')

suite('integration: Utils.LicenseUtility.LicenseEvidenceGatherer', () => {

  test('no path -> throws', () => {
    const { fs } = memfs({ '/': {} })
    const leg = new LicenseEvidenceGatherer({ fs })
    assert.throws(
      () => { Array.from(leg.getFileAttachments('/foo')) },
      {
        code: 'ENOENT',
        message: 'ENOENT: no such file or directory, scandir \'/foo\'',
        path: '/foo',
      }
    )
  })

  test('no files', () => {
    const { fs } = memfs({ '/': {} })
    const leg = new LicenseEvidenceGatherer({ fs })
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
    // see https://reuse-standard.org/
    const { fs } = memfs({
      '/LICENSE/MIT.txt': 'MIT License text here...',
      '/LICENSE/GPL-3.0-or-later.txt': 'GPL-3.0-or-later License text here...'
    })
    const leg = new LicenseEvidenceGatherer({ fs })
    const errors = []
    const found = Array.from(
      leg.getFileAttachments(
        '/',
        (e) => { errors.push(e) }
      ))
    assert.deepEqual(found, [])
    assert.deepEqual(errors, [])
  })

  test('ignore LICENSES folder', () => {
    // see https://reuse-standard.org/
    const { fs } = memfs({
      '/LICENSES/MIT.txt': 'MIT License text here...',
      '/LICENSES/GPL-3.0-or-later.txt': 'GPL-3.0-or-later License text here...'
    })
    const leg = new LicenseEvidenceGatherer({ fs })
    const errors = []
    const found = Array.from(
      leg.getFileAttachments(
        '/',
        (e) => { errors.push(e) }
      ))
    assert.deepEqual(found, [])
    assert.deepEqual(errors, [])
  })

  test('reports unreadable files', () => {
    // see https://reuse-standard.org/
    const { fs } = memfs({
      '/LICENSE': 'license text here...',
    })
    const expectedError = new Error(
      'skipped license file /LICENSE',
      { cause: new Error('Custom read error: Access denied!') })
    fs.readFileSync = function () { throw expectedError.cause }
    const leg = new LicenseEvidenceGatherer({ fs })
    const errors = []
    const found = Array.from(
      leg.getFileAttachments(
        '/',
        (e) => { errors.push(e) }
      ))
    assert.deepEqual(found, [])
    assert.deepEqual(errors, [expectedError])
  })

  test('finds licenses as expected', () => {
    // see https://reuse-standard.org/
    const { fs } = memfs({
      '/LICENSE': 'LICENSE file expected',
      '/LICENCE': 'LICENCE file expected',
      '/UNLICENSE': 'UNLICENSE file expected',
      '/UNLICENCE': 'UNLICENCE file expected',
      '/NOTICE': 'NOTICE file expected',
      '/MIT.license': 'MIT.license file expected',
      '/MIT.licence': 'MIT.licence file expected',
      '/license.mit': 'license.mit file expected',
      '/license.txt': 'license.txt file expected',
      '/license.js': 'license.js file unexpected',
    })
    const leg = new LicenseEvidenceGatherer({ fs })
    const errors = []
    const found = Array.from(
      leg.getFileAttachments(
        '/',
        (e) => { errors.push(e) }
      ))
    function orderByFilePath (a, b) {
      return a.filePath.localeCompare(b.filePath)
    }
    assert.deepEqual(found.sort(orderByFilePath), [
      {
        'filePath': '/LICENSE',
        'file': 'LICENSE',
        'text': new Attachment(
          'TElDRU5TRSBmaWxlIGV4cGVjdGVk', {
            'contentType': 'text/plain',
            'encoding': 'base64'
          })
      },
      {
        'filePath': '/LICENCE',
        'file': 'LICENCE',
        'text': new Attachment(
          'TElDRU5DRSBmaWxlIGV4cGVjdGVk', {
          'contentType': 'text/plain',
          'encoding': 'base64'
        })
      },
      {
        'filePath': '/UNLICENCE',
        'file': 'UNLICENCE',
        'text': new Attachment(
          'VU5MSUNFTkNFIGZpbGUgZXhwZWN0ZWQ=', {
            'contentType': 'text/plain',
            'encoding': 'base64'
          })
      },
      {
        'filePath': '/UNLICENSE',
        'file': 'UNLICENSE',
        'text': new Attachment(
          'VU5MSUNFTlNFIGZpbGUgZXhwZWN0ZWQ=', {
            'contentType': 'text/plain',
            'encoding': 'base64'
          })
      },
      {
        'filePath': '/NOTICE',
        'file': 'NOTICE',
        'text': new Attachment(
          'Tk9USUNFIGZpbGUgZXhwZWN0ZWQ=', {
            'contentType': 'text/plain',
            'encoding': 'base64'
          })
      },
      {
        'filePath': '/MIT.license',
        'file': 'MIT.license',
        'text': new Attachment(
          'TUlULmxpY2Vuc2UgZmlsZSBleHBlY3RlZA==',{
            'contentType': 'text/plain',
            'encoding': 'base64'
          })
      },
      {
        'filePath': '/MIT.licence',
        'file': 'MIT.licence',
        'text': new Attachment(
          'TUlULmxpY2VuY2UgZmlsZSBleHBlY3RlZA==',{
          'contentType': 'text/plain',
          'encoding': 'base64'
        })
      },
      {
        'filePath': '/license.mit',
        'file': 'license.mit',
        'text': new Attachment(
          'bGljZW5zZS5taXQgZmlsZSBleHBlY3RlZA==', {
          'contentType': 'text/plain',
          'encoding': 'base64'
        })
      },
      {
        'filePath': '/license.txt',
        'file': 'license.txt',
        'text': new Attachment(
          'bGljZW5zZS50eHQgZmlsZSBleHBlY3RlZA==', {
          'contentType': 'text/plain',
          'encoding': 'base64'
        })
      }
    ].sort(orderByFilePath))
    assert.deepEqual(errors, [])
  })

})
