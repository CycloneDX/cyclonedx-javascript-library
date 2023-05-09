# Resources: Schema files

some schema for offline use as download via [script](../../tools/schema-downloader/download.cjs). 
original sources: <https://github.com/CycloneDX/specification/tree/master/schema>

Currently using version
[ef71717ae0ecb564c0b4c9536d6e9e57e35f2e69](https://github.com/CycloneDX/specification/tree/ef71717ae0ecb564c0b4c9536d6e9e57e35f2e69/schema)

| file | note |
|------|------|
| [`bom-1.0.SNAPSHOT.xsd`](bom-1.0.SNAPSHOT.xsd) | applied changes: 1 |
| [`bom-1.1.SNAPSHOT.xsd`](bom-1.1.SNAPSHOT.xsd) | applied changes: 1 |
| [`bom-1.2.SNAPSHOT.xsd`](bom-1.2.SNAPSHOT.xsd) | applied changes: 1 |
| [`bom-1.3.SNAPSHOT.xsd`](bom-1.3.SNAPSHOT.xsd) | applied changes: 1 |
| [`bom-1.4.SNAPSHOT.xsd`](bom-1.4.SNAPSHOT.xsd) | applied changes: 1 |
| [`bom-1.2.SNAPSHOT.schema.json`](bom-1.2.SNAPSHOT.schema.json) | applied changes: 2,3,4 |
| [`bom-1.3.SNAPSHOT.schema.json`](bom-1.3.SNAPSHOT.schema.json) | applied changes: 2,3,4 |
| [`bom-1.4.SNAPSHOT.schema.json`](bom-1.4.SNAPSHOT.schema.json) | applied changes: 2,3,4 |
| [`bom-1.2-strict.SNAPSHOT.schema.json`](bom-1.2-strict.SNAPSHOT.schema.json) | applied changes: 2,3,4 |
| [`bom-1.3-strict.SNAPSHOT.schema.json`](bom-1.3-strict.SNAPSHOT.schema.json) | applied changes: 2,3,4 |
| [`spdx.SNAPSHOT.xsd`](spdx.SNAPSHOT.xsd) | |
| [`spdx.SNAPSHOT.schema.json`](spdx.SNAPSHOT.schema.json) | |
| [`jsf-0.82.SNAPSHOT.schema.json`](jsf-0.82.SNAPSHOT.schema.json) | |

changes: 
1. `http://cyclonedx.org/schema/spdx` was replaced with `spdx.SNAPSHOT.xsd`
2. `spdx.schema.json` was replaced with `spdx.SNAPSHOT.schema.json`
3. `properties.$schema.enum` was fixed to match `$id`
4. `required.version` removed, as it is actually optional with default value
