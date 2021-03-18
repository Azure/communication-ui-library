# Creating a Release

Releases can be created manually or by using the created GitHub actions (preferred).

## Creating a release through GitHub actions (Preferred)
1. Trigger the "Bump npm packages and create changelogs" GitHub action
    Enter the branch or tag you are looking to create a release off. Likely this will be a tag of an alpha build that has been well tested.
1. This will bump the package versions, generate the changelog and put up a PR into main.
1. Next, review the changelog in the PR and prune the changelog as necessary -- ensure the changelog looks good and changelog lines that equate to small PRs for the same feature are combined.
1. Also double check the package versions are as expected.
1. Complete the PR into main _without deleting the branch_ (or restore the branch if you accidently forget to not delete it on completion)
1. Run the "Publish npm packages" GitHub action and enter the branch name from the previous step
    * Enter the tag also if desired, if releasing a new public version the tag name will be `latest`. A beta release would be `next` and an alpha release would be `dev`.
1. Ensure the action completes successfully then verify on https://www.npmjs.com/ that the package(s) published successfully.


## Manually creating a release
To manually create a release:
1. Checkout onto the branch or tag with the changes you wish to publish.
1. Create a release branch off from this. e.g.
    ```
    git fetch --all # Ensure you have the latest remote details
    git checkout v.1.2.3 # Checkout a git tag
    git checkout -b release/manual/v.1.2.4 # Create feature branch
    ```
1. Bump the package versions
    ```
    npx beachball bump
    ```
    This will bump the package versions, as well as delete the change files and generate the changelog.
1. Prune the changelog (see "Creating a release through GitHub actions" for details except do this locally instead of in a PR)
1. Put up a PR of the changes into main
1. When the PR is completed, _on your release branch_, upload the packages to azure publishing pipelines - more details to follow once the publishing is set up.
1. Once the action has completed, verify on https://www.npmjs.com/ that the package(s) published successfully.

## Submitting a hotfix
There is currently no GitHub action for creating a hotfix and must be done manually.
Todo: detail the process.

## Other release types

### Creating alpha releases
Alpha releases are created nightly using the [.github/workflows/nightly-ci.yml](https://github.com/Azure/communication-ui-sdk/blob/main/.github/workflows/nightly-ci.yml) GitHub action.

They use beachball's `canary` CLI command to temporarily set all package versions to \<version\>-alpha+yyyymmdd-HHMM, create npm packages of each package and then upload the packages to the azure release pipeline.

### Creating beta releases
Creating a beta release is the same as creating a regular release, however the package.jsons' version must have the `-beta` suffix and all changelogs must have `prerelease` or `none` as their change type. This will be typically during prerelease phases before a new major version is released.

To create a beta release, ensure the above conditions then follow the instructions for "Creating a release through GitHub actions" or "Manually creating a release".

# Publishing packages

To ensure our packages are part of the `@Azure` organization our packages are published using Azure's publishing pipeline.

This is currently being setup, more details to follow.