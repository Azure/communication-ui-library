# Docs

## Contribution Guide

Looking to make a contribution to this repo? Check out our guide for a walk-through on how to make your first contribution:

1. [Getting Set up](<./contributing-guide/1. getting-set-up.md>)
2. [Building Samples and Packages](<./contributing-guide/2. build-samples-and-packages.md>)
3. [Running a Sample or Storybook](<./contributing-guide/3. running-a-sample-or-storybook.md>)
4. [Testing your changes](<./contributing-guide/4. testing-your-changes.md>)
5. [Writing unit tests](<./contributing-guide/5. writing-unit-tests.md>)
6. [Submitting a PR](<./contributing-guide/6. submitting-a-pr.md>)
7. [Having your changes published](<./contributing-guide/7. having-your-changes-published.md>)

## Architecture

- [Creating Customizable UI Components](./architecture/CustomizableComponent.md) - Best practices and examples on creating delightful UI components
- [Declarative Component Design](./architecture/ComponentDesign.md)
- [Framework Design Principles](./architecture/DesignPrinciples.md) - Core tenets our packages must build towards
- [Specifying Package Dependencies](./architecture/DependencySpecification.md) - Decide where to specify package dependencies

## Repo Infrastructure

- [API extractor](./infrastructure/api-extractor.md) - Preventing breaking changes
- [Beachball](./infrastructure/beachball.md) - Package version bumper and changelog generator
- [Chromatic](./infrastructure/chromatic.md) - Chromatic visual testing
- [ESLint and Prettier](./infrastructure/linting.md) - Code style enforcing
- [GitHub Issue templates](./infrastructure/issue-templates.md) - GitHub bug and feature request templates
- [Jest](./infrastructure/jest.md) - Unit test framework
- [Pull Request Gates and Templates](./infrastructure/pull-requests.md) - Gates blocking PRs and the PR template
- [Rollup](./infrastructure/rollup.md) - Used to create hybrid npm package (generates commonjs bundle)
- [Rush monorepo manager](./infrastructure/rush.md) - Why Rush is used and useful Rush commands

## References

- [Package releases](./releases/README.md) - Process for releasing new versions of packages developed in this repo
- [Automated tests help us move fast](./references/automated-tests.md)
- [Reviewer notes](./reviewer-notes/README.md) - Common guidelines gleaned through code reviews
- [Hero sample maintenance](./releases/hero-samples.md) - When and how to update hero samples
- [Release change-logs](./references/release-changelogs.md) - describes how we maintain change-logs for releases