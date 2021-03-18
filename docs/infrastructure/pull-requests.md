# Pull Requests

## PR Gates

We have a number of different gates used to validate a Pull Request before it is merged into main.
As of writing, the following must pass without warnings:

* ✅ At least 2 reviewers
* ✅ Builds (all packages, samples and storybook)
* ✅ Unit tests
* ✅ Linting
* ✅ Change file check (see ./beachball.md for more information)
* ✅ API changes check (see ./api-extractor.md for more information)

The github action can be found at [.github/workflows/ci.yml](https://github.com/Azure/communication-ui-sdk/blob/main/.github/workflows/ci.yml)

## PR Templates

We use a PR template file to provide quick guidance on how to write a descriptive PR description to help facilitate quality reviewing. This file can be found and updated at [.github/PULL_REQUEST_TEMPLATE.md](https://github.com/Azure/communication-ui-sdk/blob/main/.github/PULL_REQUEST_TEMPLATE.md)
