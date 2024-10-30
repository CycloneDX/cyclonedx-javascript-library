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


import {extname} from "path";

export type MimeType = string

const MAP_TEXT_EXTENSION_MIMETYPE: Readonly<Record<string, MimeType>> = {
  '': 'text/plain', // our scope is text!
  '.licence': 'text/plain',
  '.license': 'text/plain',
  '.md': 'text/markdown',
  '.rst': 'text/prs.fallenstein.rst',
  '.txt': 'text/plain',
  '.xml': 'text/xml' // not `application/xml` -- our scope is text!
} as const

export function getMimeTypeForTextFile (filename: string): MimeType | undefined {
  return MAP_TEXT_EXTENSION_MIMETYPE[extname(filename).toLowerCase()]
}
