# Automation tests for Azure Communication Services UI Library Samples

This is an automation tests folder for UI Library Samples, which contains all UI tests for samples.

## Running tests

1. Finish running `rush install` and `rush build`.
2. Set your connection string in `./.env` file (replace [REPLACE_WITH_CONNECTION_STRING]).
3. `rushx test:e2e:[testName]]` (See table below to find the testName)

### Test folder to test name mappings
| Test Folder  | Test Name  |
|---|---|
| StaticHtmlComposites | bundle |

## Folder structure
If you are adding new tests for samples, please follow this folder structure:
.
├── [Sample Folder Name]                   # Tests for the sample folder
├── common                                 # utils and common code for testing
├── .env                                   # Environment file which setup a connection string for local tests
├── playwright.config.ts                   # playwright config file
├── globalSetup.ts                         # Setting up file server for automation test
├── package.json                   
└── README.md