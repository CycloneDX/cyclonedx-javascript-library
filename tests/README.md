# Tests

Tests are written in plain JavaScript.  
Tests are intended to test the build result(`dist.node/` & `dist.web/`), instead of the source(`src/`).

The test runner will NOT build the project; you need to do so manually on demand.
See the [dedicated contributing docs](../CONTRIBUTING.md) for details and advanced instructions.

## Writing tests

Test files must follow the pattern `**.{spec,test}.[cm]?js`, to be picked up.

## Run node tests

Test runner is `mocha`, configured in [mocharc file](../.mocharc.js).

```shell
npm test
```
### Snapshots

Some tests check against snapshots.  
To update these, set the env var `CJL_TEST_UPDATE_SNAPSHOTS` to a non-falsy value.

like so:
```shell
CJL_TEST_UPDATE_SNAPSHOTS=1 npm test
```

## Run browser tests

_TODO:_ generate mocha for browser and run it in a headless env.
