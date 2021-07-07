# Chromatic

## What is Chromatic?

Chromatic automates gathering UI feedback, visual testing, and documentation, so developers can iterate faster with less manual work.
<https://www.chromatic.com>

## What does Chromatic do?

- Generates a unique public Storybook URL for each pull request
- Detects visual changes in Storybook components
- Allows manual inspection of Storybook component changes

## Automatic Publish to Chromatic

This repository has a github action for automatically publishing a branch to Chromatic on every Pull Request that changes code inside the package `storybook` or a package dependency like `@internal/react-composites`

This Github action is called `Publish Chromatic`.

Checkout the [`.yml` file](../../.github/workflows/publish-chromatic.yml) or the [github action](https://github.com/Azure/communication-ui-library/actions/workflows/publish-chromatic.yml) for more information.

## Publish a branch to Chromatic Manually

**Project Token**
You will need the project token to publish to chromatic manually.
If you have access to our Chromatic App, it's Project token can be found [here](https://www.chromatic.com/manage?appId=60c7ae6891f0e90039d7cd54&view=configure).

**Publish Command**
You can publish a branch locally using the following command.

```sh
chromatic --project-token=<PROJECT_TOKEN>
```

## Access to Chromatic

The official Chromatic App can be found at
<https://www.chromatic.com/builds?appId=60c7ae6891f0e90039d7cd54>

For requesting access to Chromatic, please reach out to any of the following users:

- Anjul Garg <anjulgarg@microsoft.com>
- James Burnside <jaburnsi@microsoft.com>
