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

module.exports = {

  /**
   * Capitalise the first letter of a string
   *
   * @param {string} s
   * @returns {string}
   */
  capitaliseFirstLetter: s => s.charAt(0).toUpperCase() + s.slice(1),

  /**
   * UpperCamelCase a string
   *
   * @param {string} s
   * @returns {string}
   */
  upperCamelCase: s => s.replace(
    /_/g,
    ' '
  ).replace(
    /\b\w/g,
    f => f.slice(-1).toUpperCase()
  ).replace(/\W/g, ''),

  /**
   * Generate a random string of length.
   *
   * @param {number} length
   * @returns {string}
   */
  randomString: length => Math.random().toString(32).substring(2, 2 + length).padEnd(length, 'x')
}
