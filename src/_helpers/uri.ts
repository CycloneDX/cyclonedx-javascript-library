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

const escapeMap: Readonly<Record<string, string>> = Object.freeze({
  ' ': '%20',
  '[': '%5B',
  ']': '%5D',
  '<': '%3C',
  '>': '%3E',
  '{': '%7B',
  '}': '%7D'
})

/**
 * Make a string valid to
 * - XML::anyURI spec.
 * - JSON::iri-reference spec.
 *
 * BEST EFFORT IMPLEMENTATION
 *
 * @see http://www.w3.org/TR/xmlschema-2/#anyURI
 * @see http://www.datypic.com/sc/xsd/t-xsd_anyURI.html
 * @see https://datatracker.ietf.org/doc/html/rfc2396
 * @see https://datatracker.ietf.org/doc/html/rfc3987
 */
export function escapeUri<T extends (string | undefined)> (value: T): T {
  if (value === undefined) {
    return value
  }
  for (const [s, r] of Object.entries(escapeMap)) {
    /* @ts-expect-error -- TS does not properly detect that value is to be forced as string, here */
    value = value.replace(s, r)
  }
  return value
}
