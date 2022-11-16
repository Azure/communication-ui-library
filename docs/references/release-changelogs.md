# Release change-logs

A clear and exhaustive [change-log](https://en.wikipedia.org/wiki/Changelog) is essential for customers who depend on the [`@azure/communication-react` package on NPM](https://www.npmjs.com/package/@azure/communication-react) to be able to update to newer versions of the package with confidence.

Our change-log is mantained in-tree, rooted in the [top-level CHANGELOG.md file](https://github.com/Azure/communication-ui-library/blob/main/CHANGELOG.md).

Because we separate [stable and beta release channels for the package](./beta-only-features.md), we need to maintain separate change-logs for customers on those channels. The top-level change-log links to these separate change-logs.

At a high level, change-log maintenance happens in two steps:

- Each change, in the form of a Pull Request to `main` in this repository adds a change-file - a file with a short description and type of the change.
  - Developers generate these files by running `rush changelog` and CI enforces the existance of change files in Pull Requests.
- The change-files are collected and summarized into the change-logs as part of the [release process](../releases/creating-a-release.md).

## Under the hood

Under the hood, our change-log tooling is built atop [beachball](https://microsoft.github.io/beachball/overview/getting-started.html). We do have a fair bit of customization / wrapping tooling to make it work with two release channels. The wrappers live in the [common/scripts/changelog/](../../common/scripts/changelog/) folder.

### `rush changelog`

As described above, developers create change-files via `rush changelog`. This is powered by [a wrapper of `beachball change`](../../common/scripts/changelog/change.mjs), but with the following significant differences:

- Change-files are only created for `packages/communication-react` as that is the only public package we publish to NPM.
- Each invocation of `rush changelog` creates a change-file. This is not how `beachball change` usually works:
  - A change-file is created even if there is no change, or if a change-file already exists on the branch
  - Corollary: running the tool multiple times creates multiple change-files
- Change-files are duplicated in a [`change-beta`](../../change-beta) folder for beta releases in addition to the default [`change`](../../change) folder for stable releases.

The less magical behavior of `rush changelog` as compared to `beachball change` gives control to the developers. For example, if a PR contains two different functional changes, it should include a change-file for each of those changes.

### `common/scripts/changelog/check.mjs`

This is a tool similar to `beachball check` with the significant difference in behavior that it checks for change-files compared to the base branch of a Pull Request. It is used by CI and should not be used by developers locally.

### `common/scripts/changelog/collect.mjs`

The change-logs for stable and beta releases are maintained separately. As part of package release preparation, we use this script to update these change-logs and delete the collected change-files.

Under the hood, this script uses `beachball bump`, but it avoids actually bumping the package versions (done in a separate release automation step) and uses temporary files to make sure that the correct change-log is updated based on the type of release.

Relevant files in the repo are:

    - change/
      - *
    - change-beta/
      - *
    - packages/
      - communication-react/
        - CHANGELOG.beta.md
        - CHANGELOG.stable.md

- When collecting change-logs for stable release, all the files under `change/` are collected into `packages/communication-react/CHANGELOG.stable.md`
- When collecting change-logs for beta release, all the files under `change-beta/` are collected into `packages/communication-react/CHANGELOG.beta.md`