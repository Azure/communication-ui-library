## What is Beachball?
[Beachball](https://microsoft.github.io/beachball/) is a semantic version bumping tool and changelog generator.

### What is semantic version bumping?
Semantic versioning (or semver for short) is a notation system for package versioning. It outlays that package version notation should follow MAJOR.MINOR.PATCH. e.g. v.3.1.2 equates to a major version of 3, a minor version of 2 and a patch version of 1. For more information see: https://semver.org/

Semantic version bumping is how we increment that version in our packages. Again this is detailed significantly on https://semver.org/ so definitely check that out but in short:

* MAJOR: This indicated a breaking change has occurred. We should never have a breaking change unless we are planning a significant new release.
* MINOR: A backwards compatible new feature has been added.
* PATCH: A small, backward compatible bug fix was added.

### Alpha and Beta releases

Along with regular package verion updates, we also produce alpha releases nightly, and beta releases when we are working towards a new major version release.
* Nightly Alpha versions follow the following syntax: v.#.#.#-alpha+yyyymmdd-HHMM
* Beta versions follow the following syntax: v.#.#.#-beta.#

## What does Beachball do

We use beachball for three main functions:
1. Produce `change` files
1. Bump our package versions and update sample package dependencies
1. Generate changelogs

## How do I run beachball

### Generate change files
`rushx changelog`

### Package version bumping
This is done by our github actions. If this needs to be down manually you can run `npm run beachball -- bump` under `common/release`.

### Changelog Generation


## Gating PRs
Pull Request builds check that the necessary change file(s) have been included in the PR and will fail if they were not checked in.

## Configuration Files