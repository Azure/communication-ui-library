# Automated tests

While we rely on [manual bug bashes](../releases/release-checklist.md) to keep up release quality, automated tests that run as part of our CI are the primary mechanism to maintain a high quality bar on the `main` branch and in our releases.

## Tests of many colors

The packlets in this repo contain the following types of tests:

### Unit tests

Many packlets contain unit-tests -- these are small isolated tests that test some API boundary or particularly complex piece of business logic. We use the [jest](https://jestjs.io/) test framework for unit-tests.

### Browser tests

This being a UI library, we need some way to validate the final UI rendered in the browswer. We use [playwright](https://playwright.dev/) to write tests that load a test application in the browswer and then capture snapshots / assert conditions about the state of the DOM to validate the UI.

The following packlets contain browswer tests:

* [packages/react-composites](../../packages/react-composites/tests/README.md)
* [samples/tests](../../samples/tests/README.md)

#### Hermetic tests vs Live Tests

Broswer tests come in two varieties:

* *Live tests* load up a test application that works with actual Azure Communication Services backend services. These are slow to run, must be run serially (for throttling reasons),a nd tend to be flaky. But they test the UI against live services, giving us high confidence when they pass.
* *Hermetic tests* fake out the backend Azure Communication Services API calls and drive the UI with faked out data. These are fast to run, can be run concurrently, and tend to be less flaky than live tests. The risk here is that the faked out services may not be faithful to the backend services, and the fakes are limited in their ability to mimick backend behavior for deep user journeys.

#### Pinned version of Chrome

Our UI tests that run inside GitHub actions use a pinned version of Chrome. This ensures the UI remains consistent when the GitHub runner images are updated with new versions of Chrome. To do this, the GitHub actions download a stable version of Chrome from [Chrome for Testing](https://developer.chrome.com/blog/chrome-for-testing/#versioned_browser_binaries), then sets the `CHROME_PATH` environment variable to tell playwright to use that version of Chrome.

**Note**: This must be updated periodically as a seperate PR, updating snapshots as necessary, to keep up with the latest stable version of Chrome. Recommendation is to update this every 6 months.

### Storybook snapshots

We also use [storybook snapshot tests](https://storybook.js.org/docs/react/writing-tests/snapshot-testing) to validate the rendered UI, especialy for the fine-grained UI components.

    TODO: Document storybook snapshot tests in `packages/storybook` and link here.

We have considered dropping these tests in the past because the samples browser tests provide some of the same coverage and these snapshots tend to change a lot.

## Which tests should I write?

Most often, you should write a combination of unit-tests and hermetic browser tests. An exception is that for critical user journies, you may write a live browser test to ensure that the UI library continues to work as expected in the wild.

| Test Type         |  Characteristics                  | When to write                               |
| ----------------- | --------------------------------- | ------------------------------------------- |
| unit-tests        | +fast, +not-flakey, -narrow       | Complex business logic, helper functions    |
| components        | +fast, less-flakey                 | Validate features for components only       |
| browser: hermetic | fast-ish, less-flakey, e2e/static | Validate features, composite snapshots      |
| browser: live     | -slow, -flakey, +faithful         | Smoke testing, critical user journeys       |
| storybook         | ??                                | ??                                          |

## Tests coverage

### Get unit tests coverage locally
`rushx test:coverage` command can be used to generate jest tests coverage reports locally for some packages. Currently the command is available for:
- acs-ui-common
- calling-component-binding
- calling-stateful-client
- chat-component-binding
- chat-stateful-client
- react-components
- react-composites

After running the command in a Terminal, a new `temp/jest/coverage/` folder will be created under the repository root folder and an HTML report will be generated. 
The report will be rewritten if `rushx test:coverage` is run again (even for an another package). In order to save the report to an another folder, use `rushx test:coverage --coverageDirectory <new-path-to-save-coverage-report>`.

### Download unit tests coverage report from CI workflow
Unit tests coverage is calculated for @azure/communication-react as part of the CI workflow. The coverage results are compared to the main branch coverage and a comment with this information is posted in a PR. The reports posted in CI workflow artifacts can be used to get an HTML report for @azure/communication-react if needed. 

Steps to create an HTML coverage report from the CI workflow artifacts:
- Download coverage reports from the PR artifacts
- Open `detailed-full/coverage-report.json`
- Update `/home/runner/work/communication-ui-library` in `detailed-full/coverage-report.json` to a folder where communication-react project is located locally.
- Save the file
- Run in Terminal `npx nyc report --temp-dir '<path-to-jest-coverage-report-{flavor}-folder>/detailed-full/' --report-dir <directory-path-where-html-report-will-be-saved> --reporter lcov`. This step is needed to generate an HTTML report from the JSON one.
- Open `index.html` file rom `lcov-report` folder for coverage preview.