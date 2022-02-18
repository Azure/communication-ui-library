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

# Conditionally Adding a E2E test 

## Conditional Compilation

Conditional compilation creates a problem with the e2e tests. The tests themselves are not actually conditionally compiled, while the applications themselves are served in the different flavors.

So when adding a new test to the suite keep this in mind and use the following call:

```TypeScript
test.skip(skipTestInStableFlavor());
```

The `skipTestInStableFlavor()` function is checking the environment variables of the session to check what flavor it is running in since it wont conditionally compile the test out. This function is found in the `Utils` folder under `testing` in the composites project.

## Mobile Only tests

If you are writing a test for only on Mobile make sure to add it to a test suite that is just for mobile. They will be marked with `[Mobile Only]` in the suite title. If there is not a suite for the page you are testing add one for that page with the `[Mobile only]` in the title.

Once you have added your test to the appropriate suite use the following call to make sure it is not run on the desktop project:

```Typescript
test.only('Your test name here', async ({ pages }, testInfo) => {
    // Mobile check
    test.skip(skipTestIfDesktop(testInfo));
    '...'
```

The `testInfo` parameter knows how to ask for the test project's platform which we use to check whether its desktop or not. Using this pattern will skip your desktop test.

For more information on these see [ui-tests.md](../../docs/references/ui-tests.md)

