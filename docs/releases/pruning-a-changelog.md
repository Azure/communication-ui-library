# Pruning a changelog

Beachball creates an automated changelog. While this is awesome it creates a good, but not great, changelog. Hence we have an extra step before publishing our changelog: pruning the changelog.

## How to prune a changelog

This means going through the auto generated changelog and fixing it up for customers to be able to read.

Before the changelog entries, create a heading for each new feature in the release and summarize each feature into 2-4 sentences in point form.
Then create a heading for each the following sections: Features, Bug Fixes, and Improvements where the changelog entries will be grouped. Refer to the latest [beta release notes](../../packages/communication-react/CHANGELOG.beta.md) to see an example.

Go through each changelog entry and do the following:

* Remove changelog entry if it pertains to changes STRICTLY to storybook, tests, refactoring, or internal code because it is not relevant information for customers using our UI library. Ensure the removal is correct by checking the PR link
* Couple entries that are for the same feature
  * Often we create multiple, small PRs for the one feature, if this is the case each changelog entry should be merged into a single changelog entry and all PRs should be linked
* Break changelog entry into multiple separate entries if a PR went in that fixed two or more distinctly different tasks. The entry should be broken into two separate entries that both link back to the same PR
* Fix the purpose of a changelog entry if the meaning is unclear and any spelling mistakes
* Edit changelog entry to be in present tense, capitalized, and to not end with periods
* Move the changelog entry into one of three sections created earlier

Ideally most of these are handled at PR time when the PR is reviewed. This reduces the work for whoever is creating the new release.

## Retroactively making changes to changelogs

_Can I go back and make changes to changelogs at any time? What about older versions?_

Yes! This is encouraged. If something in the changelog is unclear or wrong, no matter where it is in the changelog, definitely make a change to it and submit a PR.
