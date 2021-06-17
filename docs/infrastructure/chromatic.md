# Chromatic

## What is Chromatic?

Chromatic automates gathering UI feedback, visual testing, and documentation, so developers can iterate faster with less manual work.
<https://www.chromatic.com>

## What does Chromatic do?

- Generates a unique public Storybook URL for each pull request
- Detects visual changes in Storybook components
- Allows manual inspection of Storybook component changes

## Automatic Publish to Chromatic

The repository has a github action for automatically publishing a branch to Chromatic on every Pull Request that changes the package `storybook` or a package dependency like `react-composites`

This Github action is called `Publish Chromatic`.

Checkout the [`.yml` file](https://github.com/Azure/communication-ui-library/blob/main/.github/workflows/publish-chromatic.yml) or the [github action](https://github.com/Azure/communication-ui-library/actions/workflows/publish-chromatic.yml) for more information.

## Publish a branch to Chromatic Manually

You can publish a branch locally using the following command.

```sh
chromatic --project-token=<PROJECT_TOKEN>
```

## Access to Chromatic

For requesting access to Chromatic, please reach out to any of the following users:

- Anjul Garg <anjulgarg@microsoft.com>
- James Burnside <jaburnsi@microsoft.com>
