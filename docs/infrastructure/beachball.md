# Beachball

## What is Beachball?

[Beachball](https://microsoft.github.io/beachball/) is a semantic version bumping tool and changelog generator.

### What is semantic version bumping?

Semantic versioning (or semver for short) is a notation system for package versioning. It outlays that package version notation should follow MAJOR.MINOR.PATCH. e.g. v.3.1.2 equates to a major version of 3, a minor version of 2 and a patch version of 1. For more information see: <https://semver.org/>

Semantic version bumping is how we increment that version in our packages. Again this is detailed significantly on <https://semver.org/> so definitely check that out but in short:

* MAJOR: This indicated a breaking change has occurred. We should never have a breaking change unless we are planning a significant new release.
* MINOR: A backwards compatible new feature has been added.
* PATCH: A small, backward compatible bug fix was added.

### Alpha and Beta releases

Along with regular package version updates, we also produce alpha releases nightly, and beta releases when we are working towards a new major version release.

* Nightly Alpha versions follow the following syntax: v.#.#.#-alpha+yyyymmdd-HHMM
* Beta versions follow the following syntax: v.#.#.#-beta.#

See [creating a release](../references/creating-a-release.md) for more information.

## What does Beachball do

We use beachball for three main functions:

1. Produce `change` files
1. Bump our package versions and update sample package dependencies
1. Generate changelogs

### Generate change files

Change files are short json files created after running `beachball change`. We have aliased this in our repo to simply be `rush changelog`. They detail if the change was major/minor/patch/prerelease/none and also include a short description of the change that was made.

For more information on change files see: <https://microsoft.github.io/beachball/concepts/change-files.html>

For writing a good changelog entry for the change file see: [Tips for writing meaningful changelog entries](../references/tips-for-writing-changelog-entries).

### Package version bumping

This is done by our github actions. If this needs to be down manually you can run `npm run beachball -- bump` under `common/config`.
See [creating a release](../references/creating-a-release.md) for more information.

### Changelog Generation

This happens as part of the `beachball bump` command. In our repo however we have custom changelog renderers to create a feature rich changelog with links to PRs and authors.

These custom renderers are located here: [common/config/beachball/changelog-custom-renders.ts](https://github.com/Azure/communication-ui-library/blob/main/common/config/beachball/changelog-custom-renders.ts).

## Gating PRs

Pull Request builds check that the necessary change file(s) have been included in the PR and will fail if they were not checked in.
To see all PR gates, view [pull requests](./pull-requests.md) docs.

## Configuration Files

The primary beachball configuration file is at: [common/config/beachball/changelog-config.ts](https://github.com/Azure/communication-ui-library/blob/main/common/config/beachball/changelog-config.ts). This is picked up by the root level `beachball.config.js`.

Each `package.json` must also not be marked `private:true` or beachball will ignore it and may optionally contain a `beachball:` section that contains package specific configuration.
