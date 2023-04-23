# JSON validator

It was goal of https://github.com/CycloneDX/cyclonedx-javascript-library/pull/520
to add validation support for JSON BOM documents based on the CycloneDX JSON-schema specification.

JSON schema are following draft7.

There are several tools that are capable of validating with draft7 schema;
there are even benchmarks for it: <https://github.com/ebdrup/json-schema-benchmark/tree/master/draft7>

Researched tools:
* [`ajv`](https://github.com/ajv-validator/ajv)  
  with [`ajv-formats`](https://www.npmjs.com/package/ajv-formats),  
  [`ajv-formats-draft2019`](https://www.npmjs.com/package/ajv-formats-draft2019)
  * does the job, but requires plugins for the formats
  * ISSUE: required `format:ini-reference` support is broken - see <https://github.com/luzlab/ajv-formats-draft2019/issues/22>
* [`@cfworker/json-schema`](https://www.npmjs.com/package/@cfworker/json-schema)
  * initial tests passed, need to extend

## Decision

Decided to go with `ajv` for the moment,
as it was more popular/used and had a more active user base.

