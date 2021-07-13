# Creating a Release

Releases can be created manually or by using the created GitHub actions (preferred).

All new major/minor releases and new beta releases should be posted on the [internal releases Teams channel](https://teams.microsoft.com/l/channel/19%3ae12aa149c0b44318b245ae8c30365880%40thread.skype/ACS%2520Deployment%2520Announcements?groupId=3e9c1fc3-39df-4486-a26a-456d80e80f82&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47).

## Ensuring release quality

We must do due diligence in testing our packages before any new major/minor or beta release (alpha releases are exempt). To do so a release branch should be created at least 1 week before release and thoroughly bug bashed. All critical bugs must be fixed.

See the [release checklist](../references/release-checklist.md) for tasks that must be completed before releasing.

### Release branches

A release branch is created for each new version and beta release we do (alpha version are excluded from this). The release branch is a short lived branch used to ensure high release quality. The release branch is merged into main at the end of its lifecycle, however, any bug fixes submitted to this branch while active should also be cherry-picked into main to ensure minimal merge conflicts. The final release of the package is created off the release branch, the release branch can then be merged into main and closed.

## Creating a release through GitHub actions (Preferred)

1. Trigger the "Release branch - Create" GitHub action
    Enter the branch or tag you are looking to create a release off. This will usually be an alpha tag or the main branch.
1. The triggered GitHub action will bump the package versions, generate the packlet changelogs and put up a PR up into main.
1. Double check the package versions are as expected.
1. The PR will auto create a Storybook deployment that can be used for verifications.
1. Create the `@azure/communication-react` changelog in the PR. This will involve grabbing changes from the packlet changelogs and pruning the changelog lines as necessary -- ensure the changelog looks good and changelog lines that equate to small PRs for the same feature are combined. For more information see: [Pruning a Changelog](../references/pruning-a-changelog.md).
1. Ensure the "Before Release" steps of the [release checklist](../references/release-checklist.md) are completed.
1. Run the "Publish npm packages" GitHub action _off the release branch_.
    * Enter the tag also, if releasing a new public version the tag name will be `latest`. A beta release would be `next` and an alpha release would be `dev`.
1. Ensure the action completes successfully then verify on <https://www.npmjs.com/> that the package(s) published successfully.
1. Complete the post-release verification steps in [Release Checklist](../release-checklist.md).
1. (If this is a latest release) Complete the PR to merge the release branch back into `main`.
1. (If this is a latest release) Deploy the new version of storybook using the "Release branch - Publish Storybook" GitHub action.

## Manually creating a release

To manually create a release:

1. Checkout onto the branch or tag with the changes you wish to publish.
1. Create a release branch off from this. e.g.

    ```bash
    git fetch --all # Ensure you have the latest remote details
    git checkout v.1.2.3 # Checkout a git tag or release branch
    git checkout -b release/1.2.4 # Create feature branch
    ```

1. Bump the package versions

    ```bash
    npx beachball bump
    ```

    This will bump the package versions, as well as delete the change files and generate the changelog.
1. Prune the changelog (see [Pruning a Changelog](../references/pruning-a-changelog.md))
1. Put up a PR of the changes into main
1. When the PR is completed, _on your release branch_, upload the packages to azure publishing pipelines and trigger the release pipeline. For information on how to do this, see the [Azure SDK partner release wiki](https://dev.azure.com/azure-sdk/internal/_wiki/wikis/internal.wiki/1/Partner-Release-Pipeline).
1. Once the action has completed, verify on <https://www.npmjs.com/> that the package(s) published successfully.
1. Post that a new release has happened on the [internal releases Teams channel](https://teams.microsoft.com/l/channel/19%3ae12aa149c0b44318b245ae8c30365880%40thread.skype/ACS%2520Deployment%2520Announcements?groupId=3e9c1fc3-39df-4486-a26a-456d80e80f82&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47).

## Submitting a hotfix

There is currently no GitHub action for creating a hotfix and must be done manually.

1. Checkout the version you wish to fix

    ```bash
     git checkout <version-tag> # version tag will be something like v.1.2.3
    ```

1. Create a release branch from this

    ```bash
    git checkout -b hotfix/fix-security-flaw
    ```

1. Create a development branch from your release branch

    ```bash
    git checkout -b jaburnsi/chat-thread-security-patch
    ```

1. Make your changes as normal, commit your changes and put up a PR _into the release branch you made_. Ensure you specify `patch` when generating running `rush changelog`.

1. Once the PR is complete, hop onto the release branch in your terminal again (be sure to pull the latest changes that were merged into it)

    ```bash
    git checkout -b hotfix/fix-security-flaw
    git pull
    ```

1. Publish the package. _documentation to follow on publishing packages._

## Other release types

### Creating alpha releases

Alpha releases are created nightly using the [.github/workflows/nightly-ci.yml](https://github.com/Azure/communication-ui-library/blob/main/.github/workflows/nightly-ci.yml) GitHub action.

They use beachball's `canary` CLI command to temporarily set all package versions to \<version\>-alpha-yyyymmdd-HHMM, then package up the npm packages and upload the packages to the azure release pipeline.

### Creating beta releases

Creating a beta release is the same as creating a regular release, however each package.json version must have the `-beta` suffix and all changelogs must have `prerelease` or `none` as their change type. This will be typically during prerelease phases before a new major version is released.

To create a beta release, ensure the above conditions then follow the instructions for "Creating a release through GitHub actions" or "Manually creating a release".

## Publishing packages

To ensure our packages are part of the `@azure` organization our packages are published using [Azure's publishing pipeline](https://dev.azure.com/azure-sdk/internal/_wiki/wikis/internal.wiki/1/Partner-Release-Pipeline).

This requires us to first upload the tarball of the package we wish to publish to their blob storage, then trigger their release pipeline. This can be done manually or by GitHub actions.

Currently alpha package releases are entirely done through GitHub actions (see [.github/workflows/nightly-ci.yml](https://github.com/Azure/communication-ui-library/blob/main/.github/workflows/nightly-ci.yml)). This requires the use of internal keys and tokens. For more information on these, or how to update them, see: [Updating npm publishing credentials](../references/updating-npm-publishing-credentials.md).
