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

import { resolve } from 'node:path'

import { Version } from './spec/enums'

/** @internal */
export const ROOT = resolve(__dirname, '..', 'res')

/** @internal */
export const SCHEMA_ROOT = resolve(ROOT, 'schema')

/** @internal */
export const FILES = Object.freeze({
  CDX: Object.freeze({
    XML_SCHEMA: Object.freeze({
      [Version.v1dot6]: resolve(SCHEMA_ROOT, 'bom-1.6.SNAPSHOT.xsd'),
      [Version.v1dot5]: resolve(SCHEMA_ROOT, 'bom-1.5.SNAPSHOT.xsd'),
      [Version.v1dot4]: resolve(SCHEMA_ROOT, 'bom-1.4.SNAPSHOT.xsd'),
      [Version.v1dot3]: resolve(SCHEMA_ROOT, 'bom-1.3.SNAPSHOT.xsd'),
      [Version.v1dot2]: resolve(SCHEMA_ROOT, 'bom-1.2.SNAPSHOT.xsd'),
      [Version.v1dot1]: resolve(SCHEMA_ROOT, 'bom-1.1.SNAPSHOT.xsd'),
      [Version.v1dot0]: resolve(SCHEMA_ROOT, 'bom-1.0.SNAPSHOT.xsd')

    }),
    JSON_SCHEMA: Object.freeze({
      [Version.v1dot6]: resolve(SCHEMA_ROOT, 'bom-1.6.SNAPSHOT.schema.json'),
      [Version.v1dot5]: resolve(SCHEMA_ROOT, 'bom-1.5.SNAPSHOT.schema.json'),
      [Version.v1dot4]: resolve(SCHEMA_ROOT, 'bom-1.4.SNAPSHOT.schema.json'),
      [Version.v1dot3]: resolve(SCHEMA_ROOT, 'bom-1.3.SNAPSHOT.schema.json'),
      [Version.v1dot2]: resolve(SCHEMA_ROOT, 'bom-1.2.SNAPSHOT.schema.json'),
      // <= v1.1 is not defined in JSON
      [Version.v1dot1]: undefined,
      [Version.v1dot0]: undefined
    }),
    JSON_STRICT_SCHEMA: Object.freeze({
      [Version.v1dot6]: resolve(SCHEMA_ROOT, 'bom-1.6.SNAPSHOT.schema.json'),
      [Version.v1dot5]: resolve(SCHEMA_ROOT, 'bom-1.5.SNAPSHOT.schema.json'),
      [Version.v1dot4]: resolve(SCHEMA_ROOT, 'bom-1.4.SNAPSHOT.schema.json'),
      // <= 1.3 need special files
      [Version.v1dot3]: resolve(SCHEMA_ROOT, 'bom-1.3-strict.SNAPSHOT.schema.json'),
      [Version.v1dot2]: resolve(SCHEMA_ROOT, 'bom-1.2-strict.SNAPSHOT.schema.json'),
      // <= v1.1 is not defined in JSON
      [Version.v1dot1]: undefined,
      [Version.v1dot0]: undefined
    })
  }),
  SPDX: Object.freeze({
    XML_SCHEMA: resolve(SCHEMA_ROOT, 'spdx.SNAPSHOT.xsd'),
    JSON_SCHEMA: resolve(SCHEMA_ROOT, 'spdx.SNAPSHOT.schema.json')
  }),
  JSF: Object.freeze({
    JSON_SCHEMA: resolve(SCHEMA_ROOT, 'jsf-0.82.SNAPSHOT.schema.json')
  })
})
