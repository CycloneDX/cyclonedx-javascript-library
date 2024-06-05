# Optional Pluggable for node

These are _internal_ helpers, that are not intended to be exported/published.

The helpers SHALL **NOT** be marked as `@internal`, so that TypeScript might pick up on them and still render definitions for them.  
The internal defined interfaces, classes, functions are required for proper type checking downstream, but SHOULD NOT be utilized/called downstream.

Some functionality is private.  
These exports **MUST** be marked as `@internal`.
Respective files **MUST NOT** export or declare any relevant types or symbols.
Respective files **MUST** be prefixed with double-underscore ("dunder" - `__`).
