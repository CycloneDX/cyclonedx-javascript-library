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

/** @see {@link isBomLinkDocument} */
export type BomLinkDocument = string
/** @see {@link isBomLinkElement} */
export type BomLinkElement = string
/** @see {@link https://cyclonedx.org/capabilities/bomlink/} */
export type BomLink = BomLinkDocument | BomLinkElement

/* regular expressions were taken from the CycloneDX schema definitions. */
const bomLinkDocumentPattern = /urn:cdx:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[1-9][0-9]*/
const bomLinkElementPattern = /urn:cdx:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[1-9][0-9]*#.+/

export function isBomLinkDocument(value: any): value is BomLinkDocument {
  return typeof value === 'string' &&
    bomLinkDocumentPattern.test(value)
}

export function isBomLinkElement(value: any): value is BomLinkElement {
  return typeof value === 'string' &&
    bomLinkElementPattern.test(value)
}
