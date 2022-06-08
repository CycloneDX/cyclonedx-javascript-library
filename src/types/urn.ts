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

/**
 * Defines a string representation of a UUID conforming to RFC 4122.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc4122}
 * @see isUrnUuid
 */
export type UrnUuid = string

/* regular expression was taken from the CycloneDX schema definitions. */
const urnUuidPattern = /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

export function isUrnUuid (value: any): value is UrnUuid {
  return typeof value === 'string' &&
       urnUuidPattern.test(value)
}
