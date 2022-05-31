import path from 'path'

import { Version } from './spec'

/** @internal */
export const ROOT = path.resolve(__dirname, '..', 'res')

/** @internal */
export const FILES = Object.freeze({
  CDX: Object.freeze({
    XML_SCHEMA: Object.freeze(Object.fromEntries([
      [Version.v1dot0, path.resolve(ROOT, 'bom-1.0.SNAPSHOT.xsd')],
      [Version.v1dot1, path.resolve(ROOT, 'bom-1.1.SNAPSHOT.xsd')],
      [Version.v1dot2, path.resolve(ROOT, 'bom-1.2.SNAPSHOT.xsd')],
      [Version.v1dot3, path.resolve(ROOT, 'bom-1.3.SNAPSHOT.xsd')],
      [Version.v1dot4, path.resolve(ROOT, 'bom-1.4.SNAPSHOT.xsd')]
    ])),
    JSON_SCHEMA: Object.freeze(Object.fromEntries([
      // v1.0 is not defined in JSON
      // v1.1 is not defined in JSON
      [Version.v1dot2, path.resolve(ROOT, 'bom-1.2.SNAPSHOT.schema.json')],
      [Version.v1dot3, path.resolve(ROOT, 'bom-1.3.SNAPSHOT.schema.json')],
      [Version.v1dot4, path.resolve(ROOT, 'bom-1.4.SNAPSHOT.schema.json')]
    ])),
    JSON_STRICT_SCHEMA: Object.freeze(Object.fromEntries([
      // v1.0 is not defined in JSON
      // v1.1 is not defined in JSON
      [Version.v1dot2, path.resolve(ROOT, 'bom-1.2-strict.SNAPSHOT.schema.json')],
      [Version.v1dot3, path.resolve(ROOT, 'bom-1.3-strict.SNAPSHOT.schema.json')]
      // v1.4 is already strict - no special file here
    ]))
  }),
  SPDX: Object.freeze({
    XML_SCHEMA: path.resolve(ROOT, 'spdx.SNAPSHOT.xsd'),
    JSON_SCHEMA: path.resolve(ROOT, 'spdx.SNAPSHOT.schema.json')
  }),
  JSF: Object.freeze({
    JSON_SCHEMA: path.resolve(ROOT, 'jsf-0.82.SNAPSHOT.schema.json')
  })
})
