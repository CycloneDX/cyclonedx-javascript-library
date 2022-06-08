# Tests

Tests are written in plain JavaScript, and 
they are intended to test the build result(`dist.node/` & `dist.web/`),
instead of the source(`src/`).

## Writing tests

Test files must follow the pattern `**.{spec,test}.[cm]?js`,
to be picked up.

## Run node tests

Test runner is `mocha`,
configured in [mocharc file](../.mocharc.js).

```shell
npm test
```

## Run browser tests

_TODO:_ generate mocha for browser and run it in a headless env.
