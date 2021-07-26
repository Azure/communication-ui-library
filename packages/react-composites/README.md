# @internal/react-composites

Todo: _documentation to follow_

## Testing

This package contains unit-tests as browser (E2E) tests.

### Unit-tests

We use Jest as our test runner. Run these tests with:

```sh
rushx test
```

### Automated Browser Tests (E2E)

Currently, browser based tests for Chat composite on Chrome, Firefox and Webkit using Playwright are supported.

#### Install Dependencies

```sh
rush update
```

#### Create `.env` file

Create a `.env` file inside `tests/browser` directory.

The E2E browser tests require a valid connection string to run. This connection string is provided to the test runner through environment variables.
The environment variables inside a `.env` file are loaded at the beginning of E2E tests.

Sample `tests/browser/.env` file

```sh
CONNECTION_STRING=<Resource Connection String>
```

#### Build the browser tests

The browser tests require an extra build step. This build step isn't run by default when the package is built.

```sh
rushx build:e2e:chat
```

#### Run the browser tests

```sh
rushx test:e2e:chat
```
