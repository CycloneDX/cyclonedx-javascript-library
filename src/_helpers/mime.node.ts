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

import { parse as parsePath } from 'node:path'

type MimeType = string

const MIMETYPE_TEXT_PLAIN: MimeType = 'text/plain'

const MAP_TEXT_EXTENSION_MIMETYPE: Readonly<Record<string, MimeType>> = {
  '': MIMETYPE_TEXT_PLAIN,
  // https://www.iana.org/assignments/media-types/media-types.xhtml
  '.csv': 'text/csv',
  '.htm': 'text/html',
  '.html': 'text/html',
  '.md': 'text/markdown',
  '.txt': MIMETYPE_TEXT_PLAIN,
  '.rst': 'text/prs.fallenstein.rst',
  '.rtf': 'application/rtf',  // our scope is text, yes, but RTF is binary - so we should base64 encode it ...
  '.xml': 'text/xml', // not `application/xml` -- our scope is text!
  // add more mime types above this line. pull-requests welcome!
  // license-specific files
  '.license': MIMETYPE_TEXT_PLAIN,
  '.licence': MIMETYPE_TEXT_PLAIN,
} as const

const LICENSE_FILENAME_BASE: Readonly<Set<string>> =  new Set(['licence', 'license'])
const LICENSE_FILENAME_EXT: Readonly<Set<string>> = new Set([
  '.apache',
  '.bsd',
  '.gpl',
  '.mit',
  // to be continued ... pullrequests welcome
])

export function guessMimeTypeForLicenseFile (filename: string): MimeType | undefined {
  const {name, ext} = parsePath(filename.toLowerCase())
  return LICENSE_FILENAME_BASE.has(name) && LICENSE_FILENAME_EXT.has(ext)
    ? MIMETYPE_TEXT_PLAIN
    : MAP_TEXT_EXTENSION_MIMETYPE[ext]
}
