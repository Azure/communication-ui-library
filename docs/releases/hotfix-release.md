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

- Kick off the prerelease branch creation [off of the tag to hotfix](https://github.com/Azure/communication-ui-library/actions/runs/2834847602).
  ![image](https://user-images.githubusercontent.com/82062616/183989231-85067723-984a-44ca-b51a-0bc369860d24.png)
- Double check [trivial diff](https://github.com/Azure/communication-ui-library/compare/1.3.0...prerelease-stable-patch/1.3.1)
  - rush changelog seems a [little confused](https://github.com/Azure/communication-ui-library/commit/3f3c98c216720abb8ed27e69de0f428cf85fc778#diff-d23d8aa2ae11085c982faf3dfa010b91f317285f1ff1a3e163aea9ee00e1f6a0)?
- Normal: [Groom changelog](https://github.com/Azure/communication-ui-library/pull/2190)
- Kick off the release branch creation [off of the prerelease branch](https://github.com/Azure/communication-ui-library/actions/runs/2835034894).
  - Failure: The workflow can't find some required scripts.
    ![image](https://user-images.githubusercontent.com/82062616/184000212-7561d93e-0d87-4f32-8d86-714796aa59f2.png)
  - This is the classic case of evergreen workflow automation missing branch-pinned tooling support.
  - [Backport required tooling](https://github.com/Azure/communication-ui-library/pull/2192).
  - I got lucky that the backport in this case was very clean.
- Retry: Kick off release branch creation [again](https://github.com/Azure/communication-ui-library/runs/7774172170)
  - Failure: The workflow can't find some workflow config.
    ![image](https://user-images.githubusercontent.com/82062616/184002131-5936eba2-16dd-4fb6-aa5d-a482e24c799b.png)
  - [Backport](https://github.com/Azure/communication-ui-library/pull/2193) the config as well.
- Retry: Kick off release branch creation [again](https://github.com/Azure/communication-ui-library/runs/7774287156)
  - Succeeded.
  - The PR created for merging prerelease branch back is [wrong](https://github.com/Azure/communication-ui-library/pull/2194)
- Created a [manual merge back PR](https://github.com/Azure/communication-ui-library/pull/2203)