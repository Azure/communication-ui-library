# @internal/react-composites

Todo: _documentation to follow_

## Testing

### Automated Browser Tests

Currently, browser based tests for Chat composite on Chrome using puppeteer are supported.

#### Install Dependencies

```sh
rush update
```

#### Create `.env` file

The webpack bundler for test react app reads environment variables from the `.env` file and assigns them to the `process.env` variable.
These variables can then be accessed inside the code using `process.env.{VAR_NAME}`

Create a `.env` file inside `tests/browser/app` directory.

Sample `tests/browser/app/.env` file

```sh
CONNECTION_STRING=<Resource Connection String>
```

#### Running the tests

We use Jest as our test runner. Browser based tests can also be run using Jest.

```sh
rushx test
```
