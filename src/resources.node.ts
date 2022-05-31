import path from 'path'

export const ROOT = path.resolve(__dirname, '..', '..', 'res')

export const FILE_CDX_XML_SCHEMA_1_0 = path.resolve(ROOT, 'bom-1.0.SNAPSHOT.xsd')
export const FILE_CDX_XML_SCHEMA_1_1 = path.resolve(ROOT, 'bom-1.1.SNAPSHOT.xsd')
export const FILE_CDX_XML_SCHEMA_1_2 = path.resolve(ROOT, 'bom-1.2.SNAPSHOT.xsd')
export const FILE_CDX_XML_SCHEMA_1_3 = path.resolve(ROOT, 'bom-1.3.SNAPSHOT.xsd')
export const FILE_CDX_XML_SCHEMA_1_4 = path.resolve(ROOT, 'bom-1.4.SNAPSHOT.xsd')

// v1.0 is not defined in JSON
// v1.1 is not defined in JSON
export const FILE_CDX_JSON_SCHEMA_1_2 = path.resolve(ROOT, 'bom-1.2.SNAPSHOT.schema.json')
export const FILE_CDX_JSON_SCHEMA_1_3 = path.resolve(ROOT, 'bom-1.3.SNAPSHOT.schema.json')
export const FILE_CDX_JSON_SCHEMA_1_4 = path.resolve(ROOT, 'bom-1.4.SNAPSHOT.schema.json')

// v1.0 is not defined in JSON
// v1.1 is not defined in JSON
export const FILE_CDX_JSON_STRICT_SCHEMA_1_2 = path.resolve(ROOT, 'bom-1.2-strict.SNAPSHOT.schema.json')
export const FILE_CDX_JSON_STRICT_SCHEMA_1_3 = path.resolve(ROOT, 'res/bom-1.3-strict.SNAPSHOT.schema.json')
// v1.4 is already strict - no special file here

export const FILE_SPDX_XML_SCHEMA = path.resolve(ROOT, 'spdx.SNAPSHOT.xsd')
export const FILE_SPDX_JSON_SCHEMA = path.resolve(ROOT, 'spdx.SNAPSHOT.schema.json')

export const FILE_JSF_JSON_SCHEMA = path.resolve(ROOT, 'jsf-0.82.SNAPSHOT.schema.json')
