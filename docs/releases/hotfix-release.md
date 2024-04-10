# Hotfix Releases

This repository follows a green-trunk development model. All development happens on the `main` branch. Release branches are *usually* created off of the `main` branch and are short-lived.

There is one case where you may have to diverge from [the usual release process](./creating-a-release.md) -- fixing a critical bug on a prior release.

A hotfix release is:

- a release that is created to fix a critical bug in a [package version already released on NPM](https://www.npmjs.com/package/@azure/communication-react?activeTab=versions).
- always a `patch` release (never a `major` or `minor` release).
- intended to minimize the diff between the version being patched and the new release.
  - minimizing the difference allows for a high confidence release at short notice.

### Example

Consider the following scenario:

- The latest two releases of `@azure/communication-react` are versions `1.0.0` and `1.1.1`.
- `1.1.1` was released a month ago, and development has continued on `main` for the next release.

*Scenario 1*: We discover a bug in version `1.0.0` and determine that the bug is critical enough that we must release a fix. `1.0.0` being an old release, the only option is to create a hotfix release off of `1.0.0` and release it as `1.0.1`.

*Scenario 2*: We discover a bug in version `1.1.1` and determine that the bug is critical enough that we must release a fix. Because `1.1.1` is the latest release, it is possible to release the fix as `1.1.2` via the usual release process off of `main`. But that would necessarily include changes in `main` in the last month. If the fix is needed urgently, it might still make sense to release a hotfix off of the `1.1.1` release including only the required bugfix.

## Overview

Conceptually, there is only a little difference between a normal and hotfix relesae.

For a hotfix release:

- Find the git tag for the package version being hotfixed. This is the base ref for the release branch.
- Create a short-lived release branch off of the base ref (for a normal release, the base ref would have been `main`).
- Fix the bug in the release branch.
  - *Unlike a normal release* the fix need not be merged and cherry-picked from `main`. `main` may not have the bug at all, or the sources might have evolved a lot so that the bug fix looks very different on `main`.
- Release off of the hotfix release branch, create a git tag for the new release and delete the release branch.
- If the hotfix is on top of the latest release, you must update the changelog and package versions in main branch. This does not apply if the hotfix is on top of an older release.

### Here be dragons

Creating a hotfix release requires more care than the usual release process. The primary reason for this is version skew between GitHub workflows and the repository sources: GitHub workflows for release automation are always run off of the `main` branch (so that we always use the latest workflow that works best with the unversioned external infrastructure like the NPM registry). In contrast, when releasing a hotfix release, the package sources and build tooling are from the release base ref. Thus, there is a possibility of incompatibility between the workflow and the tooling / sources from the release branch.

This skew increases with the age of the base ref -- the older the version being hotfixed, the more manual intervention is needed in the release workflows.

## Playbook

As noted above, the challenges in creating a hotfix are unique to each attempt. This section can serve as a reference for future hotfixes. There is no GitHub action for creating a hotfix and must be done manually. You will want to reference the steps in our [github action that creates a release branch](../../.github/workflows/create-release-branch.yml) and ensure those steps are performed manually:

1. Checkout the version you wish to fix

    ```bash
    git checkout <version-tag> # Ex: git checkout v1.2.3
    ```

1. Create a release branch from this

    ```bash
    git checkout -b release/<new-version>
    # The new version will be a patch on top of the version you checked out
    # Ex: 1.2.3 becomes 1.2.4 or 1.2.3-beta.1 becomes 1.2.4-beta.1
    ```

1. Setup the release branch

   1. Create a branch so the following work can be put up as a PR into the release branch so it is reviewed by members of the team

      ```bash
      git checkout -b <alias>/1.2.4-branch-setup
      ```

   1. Bump the versions in the package.json files to the new version.

      For a hotfixing a stable release version:

      ```bash
      node common/scripts/bump-stable-version.js patch
      ```

      For hotfixing a beta release version:

      ```bash
      node common/scripts/bump-beta-release-version.js beta
      ```

      After this all `package.json` files should have the correct version. You can do a findAll for the old version and make sure it does not exist.

   1. Update the telemetry version to match the new version

       ```bash
       node common/scripts/sync-telemetry-package-version
       ```

       To verify this worked, make sure the [telemetryVersion.js](../../packages/acs-ui-common/src/telemetryVersion.js) file has the correct version.

   1. Update the package files to use stable or beta dependencies. If you are hotfixing a stable release, run the following command:

      ```bash
      node ./common/scripts/force-build-flavor.mjs stable
      rush update
      ```

      If you are hotfixing a beta release, run the following command:

      ```bash
      node ./common/scripts/force-build-flavor.mjs beta-stable
      rush update
      ```

      To verify this worked, look at the peer dependencies of the [communication-react/package.json](../../packages/communication-react/package.json) file and make sure they are all referencing the correct SDK versions.

   1. Create a PR for the changes made in the release branch.

        ```bash
        rush changelog
        # Then put up a PR into the release branch
        ```

1. Create a development branch from your release branch that will have the bug fix

    ```bash
    git checkout -b <alias>/hotfix-<bug-name> # Ex: git checkout -b jaburnsi/fix-security-flaw-in-fetch-function
    ```

1. Make and test your changes as normal, commit your changes and put up a PR into the release branch you made. *Include the change to the changelog in this PR as well.*

1. The release branch created above was identical in all respects to a usual release branch. Thus, [the NPM release workflow](./creating-a-release.md#step-3-publish-to-npm) should work as expected.

   - Be extra careful in going through the [release checklist](./release-checklist.md) because of the manual steps in the release branch creation.

1. Post-release steps

   1. Delete the release branch.

   1. Update the changelog in the `main` branch to include the changes made in the hotfix release.

   1. If the hotfix was off of the latest release, update the package versions in the `main` branch.
