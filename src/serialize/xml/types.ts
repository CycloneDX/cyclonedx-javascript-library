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

/* eslint-disable-next-line @typescript-eslint/no-namespace -- needed */
export namespace XmlSchema {

  const _AnyUriSchemePattern = /^[a-z][a-z0-9+\-.]*$/i

  /**
   * @see {@link isAnyURI}
   */
  export type AnyURI = string

  /**
   * Test whether format is XML::anyURI - best-effort.
   *
   * @see {@link http://www.w3.org/TR/xmlschema-2/#anyURI | anyURI spec}
   * @see {@link https://www.w3.org/2011/04/XMLSchema/TypeLibrary-URI-RFC3986.xsd | RFC 3986}
   * @see {@link https://www.w3.org/2011/04/XMLSchema/TypeLibrary-IRI-RFC3987.xsd | RFC 3987}
   *
   * @TODO add more validation according to spec
   */
  export function isAnyURI (value: AnyURI | any): value is AnyURI {
    if (typeof value !== 'string') {
      // not a string
      return false
    }
    if (value.length === 0) {
      // empty string
      return false
    }

    const fragmentPos = value.indexOf('#')
    let beforeFragment = value
    if (fragmentPos >= 0) {
      if (value.includes('#', fragmentPos + 1)) {
        // has a second fragment marker
        return false
      }
      beforeFragment = value.slice(undefined, fragmentPos)
    }

    const schemePos = beforeFragment.indexOf(':')
    if (schemePos >= 0) {
      if (!_AnyUriSchemePattern.test(beforeFragment.slice(undefined, schemePos))) {
        // invalid schema
        return false
      }
    }

    return true
  }

}

/* eslint-disable-next-line @typescript-eslint/no-namespace -- needed */
export namespace SimpleXml {

  /**
   * Attribute's name.
   *
   * Must be alphanumeric.
   * Must start with alpha.
   * Must not contain whitespace characters.
   * Should not be literal "xmlns".
   */
  export type AttributeName = string

  /**
   * Element's name.
   *
   * Must be alphanumeric.
   * Must start with alpha.
   * Must not contain whitespace characters.
   */
  export type ElementName = string

  /**
   * Textual representation.
   *
   * Be aware that low-/high-bytes could be represented as numbers.
   * They might need to be converted on serialization.
   */
  export type Text = string | number

  /**
   * Unset representation.
   *
   * Do NOT allow null here, as it is context-aware sometimes an empty string or unset,
   * in a space where context is unknown.
   */
  export type Unset = undefined

  export type ElementAttributes = Record<AttributeName, Text | Unset>

  export type ElementChildren = Iterable<Comment | Element> | Text | Unset

  /**
   * Element node.
   */
  export interface Element {
    type: 'element'
    name: ElementName
    namespace?: string | URL
    attributes?: ElementAttributes
    children?: ElementChildren
  }

  /**
   * Element node with textual content
   */
  export interface TextElement extends Element {
    children: Text
  }

  /**
   * Comment node.
   */
  export interface Comment {
    type: 'comment'
    text?: Text
  }

}
