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

import {HashAlgorithm} from '../enums/hashAlogorithm'

/**
 * See {@link https://docs.npmjs.com/cli/v9/configuring-npm/package-lock-json#packages | package lock docs} for "integrity".
 * See {@link https://blog.npmjs.org/post/172999548390/new-pgp-machinery | new pgp machinery} for "integrity".
 *
 * integrity: A sha512 or sha1 [Standard Subresource Integrity](https://w3c.github.io/webappsec/specs/subresourceintegrity/) string for the artifact that was unpacked in this location.
 */
const integrityRE: ReadonlyMap<HashAlgorithm, RegExp> = new Map([
  // !!! this list is pre-sorted, starting with most-common usage.

  /* base64 alphabet: `A-Za-z0-9+/` and `=` for padding
   * SHA-512 => base64 over 512 bit => 86 chars + 2 chars padding.
   * examples:
   * - sha512-zvj65TkFeIt3i6aj5bIvJDzjjQQGs4o/sNoezg1F1kYap9Nu2jcUdpwzRSJTHMMzG0H7bZkn4rNQpImhuxWX2A==
   * - sha512-DXUS22Y57/LAFSg3x7Vi6RNAuLpTXwxB9S2nIA7msBb/Zt8p7XqMwdpdc1IU7CkOQUPgAqR5fWvxuKCbneKGmA==
   * - sha512-5BejraMXMC+2UjefDvrH0Fo/eLwZRV6859SXRg+FgbhA0R0l6lDqDGAQYhKbXhPN2ofk2kY5sgGyLNL907UXpA==
   */
  [HashAlgorithm['SHA-512'], /^sha512-([a-z0-9+/]{86}==)$/i],

  /* base64 alphabet: `A-Za-z0-9+/` and `=` for padding
   * SHA-1 => base64 over 160 bit => 27 chars + 1 chars padding.
   * examples:
   * - sha1-aSbRsZT7xze47tUTdW3i/Np+pAg=
   * - sha1-Kq5sNclPz7QV2+lfQIuc6R7oRu0=
   * - sha1-XV8g50dxuFICXD7bZslGLuuRPQM=
   */
  [HashAlgorithm['SHA-1'], /^sha1-([a-z0-9+/]{27}=)$/i],

  /* base64 alphabet: `A-Za-z0-9+/` and `=` for padding
   * SHA-256 => base64 over 256 bit => 43 chars + 1 chars padding.
   * examples:
   * - sha256-jxzgcB+8dLn7Cjjyg7stGWMftZf6rbdvgoE85TOzmT4=
   * - sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=
   * - sha256-+8Gp+Fjqnhd5FpZL2Iw9N7kaHoRBJ2XimVB3fyZcS3U=
   */
  [HashAlgorithm['SHA-256'], /^sha256-([a-z0-9+/]{43}=)$/i],

  /* base64 alphabet: `A-Za-z0-9+/` and `=` for padding
   * SHA-384 => base64 over 384 bit => 64 chars + 0 chars padding.
   * example:
   * - sha384-aDkxLz2zQ0dwcNPAsr7NQXs1cVTUh5TQHXjPtGF+1auBmne2gy9lQt0Yu3OBMe9+
   * - sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC
   * - sha384-/b2OdaZ/KfcBpOBAOF4uI5hjA+oQI5IRr5B/y7g1eLPkF8txzmRu/QgZ3YwIjeG9
   */
  [HashAlgorithm['SHA-384'], /^sha384-([a-z0-9+/]{64})$/i]
])

/**
 * @throws {@link RangeError} if value is unparsable
 */
export function parsePackageIntegrity (integrity: string): [HashAlgorithm, string] {
  for (const [hashAlgorithm, hashRE] of integrityRE) {
    const hashMatchBase64 = hashRE.exec(integrity) ?? []
    if (hashMatchBase64.length === 2) {
      return [
        hashAlgorithm,
        Buffer.from(hashMatchBase64[1], 'base64').toString('hex')
      ]
    }
  }
  throw new RangeError('unparsable value')
}


/**
 * The default registry is `https://registry.npmjs.org`.
 * @see {@link https://github.com/package-url/purl-spec/blob/master/PURL-TYPES.rst#npm}
 */
export const defaultRegistryMatcher = /^https?:\/\/registry\.npmjs\.org(:?\/|$)/
