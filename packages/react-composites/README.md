# @internal/react-composites

Todo: _documentation to follow_

## Testing

### Automated Browser Tests (E2E)

Currently, browser based tests for Chat composite on Chrome using puppeteer are supported.

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

#### Running the tests

We use Jest as our test runner. Browser based tests can also be run using Jest.

```sh
rushx test
```
