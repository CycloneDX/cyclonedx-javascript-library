# Contributing

Pull requests are welcome.
But please read the
[CycloneDX contributing guidelines](https://github.com/CycloneDX/.github/blob/master/CONTRIBUTING.md)
first.

Be aware: even though this project supports node>=14 on runtime,
it requires node>=18 on dev-time.

## Set up the project

Install dependencies:

```shell
npm install
```

The setup will also build the project.

## Build from source

Build the JavaScript:

```shell
npm run build
```

## Test the build result

Run the tests:

```shell
npm test
```

See the [dedicated test docs](tests/README.md) for details and advanced instructions. 

## Coding standards

Apply coding standards via:

```shell
npm run cs-fix
```

## Sign off your commits

Please sign off your commits, to show that you agree to publish your changes under the current terms and licenses of the project
, and to indicate agreement with [Developer Certificate of Origin (DCO)](https://developercertificate.org/).

```shell
git commit --signed-off ...
```
