# Live tests based on sample applications

This packlet contains some live browser tests (end-to-end tests that depend on Azure Communication Services backend services) based on sample applications included in this git repo. See the [top-level testing documentation](../../docs/references/automated-tests.md) to understand how these tests fit into our overall testing strategy.


## Setup

* Build dependencies
  ```sh
  rush install
  rush build
  ```
* Set connection string in [`./.env`](./.env) file (replace [REPLACE_WITH_CONNECTION_STRING]).

See setup instructions in the [composite browser test README](../../packages/react-composites/tests/README.md) for troubleshooting guidance.


## Run tests

Tests for each sample are run via a separate script:

* Run tests for a sample application that uses the static HTML composite bundles:
  ```sh
  rush test:e2e:bundle
  ```
* Run tests for a sample application that builds upon the fine-grained UI components library:
  ```sh
  rush test:e2e:examples
  ```

## Update snapshots

Snapshots for each sample are updated via a separate script. Note that snapshot updates are somewhat dependent on the machine environment. We use a GitHub workflow to update snapshots consistently. You should not need to run these scripts in most cases.

* Update test snapshots for a sample application that uses the static HTML composite bundles:
  ```sh
  rush update:e2e:bundle
  ```
* Update test snapshots for a sample application that builds upon the fine-grained UI components library:
  ```sh
  rush update:e2e:examples
  ```

## Add new tests

**❗Live-test are costly to run and maintain**

Only include smoke tests that verify basic functionality of top-level API. For detailed tests, choose a more appropriate [testing strategy](../../docs/references/automated-tests.md).

If you are adding new tests for samples, please follow this folder structure:

    .
    ├── [Sample Folder Name]                   # Tests for the sample folder
    ├── common                                 # utils and common code for testing
    ├── .env                                   # Environment file which setup a connection string for local tests
    ├── playwright.config.ts                   # playwright config file
    ├── globalSetup.ts                         # Setting up file server for automation test
    ├── package.json
    └── README.md