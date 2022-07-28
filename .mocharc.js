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

const path = require('path')

/**
 * mocha config
 * @see {@link https://mochajs.org/#configuring-mocha-nodejs}
 * @see {@link https://github.com/mochajs/mocha/blob/master/example/config/.mocharc.js example}
 * @type {import('@types/mocha').Mocha.MochaOptions}
 */
module.exports = {
  spec: [
    'tests',
    'libs'
  ],
  recursive: true,
  parallel: false, // if true, then some IDEs cannot run it
  'check-leaks': false,
  checkLeaks: true, // browser-compat version of setting `check-leaks`
  global: [],
  extension: [
    'spec.js', 'test.js',
    'spec.cjs', 'test.cjs',
    'spec.mjs', 'test.mjs',
  ],
  ui: 'tdd',
  reporter: 'mocha-junit-reporter',
  reporterOptions: {
    // region mocha-junit-reporter options
    // see https://github.com/michaelleeallen/mocha-junit-reporter#results-report
    mochaFile: path.join(__dirname, 'reports', 'mocha-tests.[hash].junit.xml'), // @FIXME is not used at all - see https://github.com/michaelleeallen/mocha-junit-reporter/issues/112
    // testsuitesTitle: true, // @FIXME causes issues
    outputs: true,
    toConsole: true // @FIXME is not used at all
    // endregion mocha-junit-reporter options
  }
}
