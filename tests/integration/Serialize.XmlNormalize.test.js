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

const assert = require('assert')
const { describe, beforeEach, afterEach, it } = require('mocha')

const { createComplexStructure } = require('../_data/models')
const { loadNormalizeResult, writeNormalizeResult } = require('../_data/normalize')

const {
  Models, Enums,
  Serialize: {
    XML: { Normalize: { Factory: XmlNormalizeFactory } }
  },
  Spec: { Spec1dot2, Spec1dot3, Spec1dot4 }
} = require('../../')

describe('Serialize.XmlNormalize', function () {
  this.timeout(60000);

  [
    Spec1dot2,
    Spec1dot3,
    Spec1dot4
  ].forEach(spec => describe(`complex with spec v${spec.version}`, () => {
    const normalizerFactory = new XmlNormalizeFactory(spec)

    beforeEach(function () {
      this.bom = createComplexStructure()
    })

    afterEach(function () {
      delete this.bom
    })

    it('can normalize', function () {
      normalizerFactory.makeForBom().normalize(this.bom, {})
      // this test does not produce reproducible results,
      // do its just fair enough it did not crash
    })

    it('can normalize with sorted lists', function () {
      const normalized = normalizerFactory.makeForBom()
        .normalize(this.bom, { sortLists: true })

      const json = JSON.stringify(normalized, null, 2)

      if (process.env.CJL_TEST_UPDATE_SNAPSHOTS) {
        writeNormalizeResult(json, 'xml_sortedLists', spec.version, 'json')
      }

      assert.deepStrictEqual(
        JSON.parse(json),
        JSON.parse(loadNormalizeResult('xml_sortedLists', spec.version, 'json'))
      )
    })

    // TODO add more tests
  }))

  describe('ExternalReference\'s `anyURI`', () => {
    const normalizer = new XmlNormalizeFactory(Spec1dot4).makeForExternalReference()

    describe('omit invalid', () => {
      [
        // only one fragment allowed
        'foo#bar#baz',
        // scheme must follow the RFC
        'git@github.com:peterolson/BigInteger.js.git',
        'git%40github.com:peterolson/BigInteger.js.git',
        ':foo-bar'
      ].forEach(uri => it(`${uri}`, () => {
        const ref = new Models.ExternalReference(uri, Enums.ExternalReferenceType.Other)
        const normalized = normalizer.normalize(ref, {}, 'ref')
        assert.strictEqual(normalized, undefined)
      }))
    })
    describe('render valid', () => {
      [
        'https://github.com/peterolson/BigInteger.js.git',
        'git+ssh:git@github.com:peterolson/BigInteger.js.git',
        'example.com:8080/foo/bar',
        'foo#bar',
        'foo@bar.com',
        'g#it@github.com:peterolson/BigInteger.js.git'
      ].forEach(uri => it(`${uri}`, () => {
        const ref = new Models.ExternalReference(uri, Enums.ExternalReferenceType.Other)
        const normalized = normalizer.normalize(ref, {}, 'ref')
        assert.deepStrictEqual(normalized, {
          type: 'element',
          name: 'ref',
          attributes: { type: 'other' },
          children: [{
            type: 'element',
            name: 'url',
            children: uri
          }]
        })
      }))
    })
  })
})
