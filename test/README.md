# Tests

Tests are written in plain JavaScript, and 
they are intended to test the build result(`dist.node/` & `dist.web/`),
instead of the source(`src/`).

## write tests

Test files must follow the pattern `**.{spec,test}.{c,m}?js`,
to be picked up.

## run node tests

```shell
npm run test
```

## run browser tests

_TODO:_ generate mocha for browser and run it in a headless env.
