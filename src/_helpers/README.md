# Helpers

These are _internal_ helpers, that are not intended to be exported/published.

The helpers shall **not** be marked as `@internal`, so that TypeScript might pick up on them and still render definitions for them.  
The internal defined interfaces, classes, functions are required for proper type checking downstream, but should not be utilized/called downstream.
