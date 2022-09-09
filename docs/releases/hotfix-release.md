# Hotfix Releases

This repository follows a green-trunk development model. All development happens on the `main` branch. Release branches are *usually* created off of the `main` branch and are short-lived.

There is one case where you may have to diverge from [the usual release process](./creating-a-release.md) - to fix a critical bug on a prior release. A hotfix release is:

- a release that is created to fix a critical bug in a [package version already released on NPM](https://www.npmjs.com/package/@azure/communication-react?activeTab=versions).
- always a `patch` release (never a `major` or `minor` release).
- intended to minimize the diff between the version being patched and the new release.
  - minimizing the difference allows for a high confidence release at short notice.

### Example

Consider the following scenario:

- The latest two releases of `@azure/communication-react` are versions `1.0.0` and `1.1.1`.
- `1.1.1` was released a month ago, and development has continued on `main` for the next release.

*Scenario 1*: We discover a bug in version `1.0.0` and determine that the bug is critical enough that we must release a fix. `1.0.0` being an old release, the only option is to create a hotfix release off of `1.0.0` and release it as `1.0.1`.

*Scenario 2*: We discover a bug in version `1.1.1` and determine that the bug is critical enough that we must release a fix. Because `1.1.1` is the latest release, it is possible to release the fix as `1.1.2` via the usual release process off of `main`. But that would necessarily include changes in `main` in the last month. If the fix is needed urgently, it might still make sense to release a hotfix off of the `1.1.1` release.


## Overview

Conceptually, there is very little difference between a normal and hotfix relesae. For a hotfix release:

- Find the git tag for the package version being hotfixed. This is the base ref for the release branch.
- Create a short-lived release branch off of the base ref (for a normal release, the base ref would have been `main`).
- Fix the bug in the release branch.
  - *Unlike a normal release* the fix need not be merged and cherry-picked from `main`. `main` may not have the bug at all, or the sources might have evolved a lot so that the bug fix looks very different on `main`.
- Release off of the hotfix release branch, create a git tag for the new release and delete the release branch.

### Here be dragons

Creating a hotfix release requires more care than the usual release process. The primary reason for this is version skew between GitHub workflows and the repository sources: GitHub workflows for release automation are always run off of the `main` branch (so that we always use the latest workflow that works best with the unversioned external infrastructure like the NPM registry). In contrast, when releasing a hotfix release, the package sources and build tooling are from the release base ref. Thus, there is a possibility of incompatibility between the workflow and the tooling / sources from the release branch.

This skew increases with the age of the base ref - the older the version being hotfixed, the more manual intervention is needed in the release workflows.

## Playbook

As noted above, the challenges in creating a hotfix are unique to each attempt. This section describes the steps that were needed to create the hotfix release branch `1.3.1`. This section can serve as a reference for future hotfixes.

### Creating the release branch

- Like a normal release, I first kicked off the prerelease branch creation, [but off of the tag to hotfix: `1.3.0`](https://github.com/Azure/communication-ui-library/actions/runs/2834847602).
  ![image](https://user-images.githubusercontent.com/82062616/183989231-85067723-984a-44ca-b51a-0bc369860d24.png)
- I double checked that there was [trivial diff](https://github.com/Azure/communication-ui-library/compare/1.3.0...prerelease-stable-patch/1.3.1) between the newly created prerelease branch and the base tag `1.3.0`.
  - `rush changelog` was [a little confused](https://github.com/Azure/communication-ui-library/commit/3f3c98c216720abb8ed27e69de0f428cf85fc778#diff-d23d8aa2ae11085c982faf3dfa010b91f317285f1ff1a3e163aea9ee00e1f6a0) and the generated `CHANGELOG.md` did not fully correspond to the trivial diff in the hotfix.
- Like a normal release, I [groomed the changelog](https://github.com/Azure/communication-ui-library/pull/2190), fixing the `CHANGELOG.md` and noting that this is a hotfix.
- I kicked off the release branch creation [off of the prerelease branch](https://github.com/Azure/communication-ui-library/actions/runs/2835034894).
  - Failure: The workflow can't find some required scripts.
    ![image](https://user-images.githubusercontent.com/82062616/184000212-7561d93e-0d87-4f32-8d86-714796aa59f2.png)
  - This is the classic case of evergreen workflow automation missing branch-pinned tooling support.
  - I [backported required tooling](https://github.com/Azure/communication-ui-library/pull/2192).
    - I got lucky that the backport in this case was very clean.
- Retry: I kicked off release branch creation [again](https://github.com/Azure/communication-ui-library/runs/7774172170)
  - Failure: The workflow can't find some workflow config.
    ![image](https://user-images.githubusercontent.com/82062616/184002131-5936eba2-16dd-4fb6-aa5d-a482e24c799b.png)
  - I [backported ported the config](https://github.com/Azure/communication-ui-library/pull/2193) as well.
- Retry: I kicked off release branch creation [again](https://github.com/Azure/communication-ui-library/runs/7774287156)
  - 3 times is lucky! It succeeded.


### Fixing the bug

The [bugfix PR](https://github.com/Azure/communication-ui-library/pull/2207) into the release branch was very targeted. It deployed a point solution to the observed bug. A larger, more complete fix will be merged in `main` later and released via the usual release process.

In this case, the bugfix PR was a cherry-pick of a [PR from `main`](https://github.com/Azure/communication-ui-library/pull/2191) because the base ref was the most recent release on NPM and skew from `main` was small.

### Releasing the package.

- The release branch created above was identical in all respects to a usual release branch. Thus, [the NPM release workflow](./creating-a-release.md#step-3-publish-to-npm) worked as expected.
  - We were extra careful in going through the [release checklist](./release-checklist.md) because of the manual steps in the release branch creation.
- The PR created for merging prerelease branch back into `main` by the automation was [wrong](https://github.com/Azure/communication-ui-library/pull/2194)
  - I created a [manual merge back PR](https://github.com/Azure/communication-ui-library/pull/2203). This PR was required so that the package version on `main` was bumped from `1.3.1` to `1.3.2-beta.0`, in preparation for the next potential release from `main`.
  - If the base ref had been from an older release (say `1.0.0`), we would not have merged the prerelease branch back into `main` at all.
