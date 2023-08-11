# Changelog Guidelines

To ease our release process, we need to follow some guidelines when adding a new changelog entry.
`rush changelog` will give developers the opportunity to create a change file to describe your changes. 
The `comment` field is used to generate the changelog entry, so it's important to follow the guidelines below.

## Type
Select whether your change is a Prerelease, Patch, Minor, and None (for more information on which to choose see [Semantic Versioning](https://semver.org/)).

When to use each type:
1. Prerelease: Changes that are not yet released to the public.
1. Patch: Bug fixes; no API changes.
1. Minor: Small feature; backwards compatible API changes.
1. None: This change does not affect the published package in any way.


## Area

The `area` field is used to group the changelog entries under specific categories.
Categories and their definitions: 
1. Bug Fix: Regression in functionality, or defect in existing functionality.
1. Feature: Net new functionality, or significant enhancement to existing functionality.
1. Improvement: Additional work on existing functionality outside of its initial dev cycle.

## Describe changes
Text field entry to describe the changes. The changelog entry to be in present tense, capitalized, and to NOT end with periods.


This is what will be included in the changelog when a new version is released, so keep it concise and meaningful. See [Tips for writing meaningful changelog entries](../reviewer-notes/tips-for-writing-changelog-entries.md).

### Examples
```md
- Add functionality to open image gallery when user taps on an inline image
- Start new `workstream` or `feature` 
- Add `functionality` to `workstream` or `feature` 
- Fix for app crash when user taps on call button
- Improve performance of the app by reducing the number of API calls
```


