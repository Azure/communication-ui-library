# Pruning a changelog

Beachball creates an automated changelog. While this is awesome it creates a good, but not great, changelog. Hence we have an extra step before publishing our changelog: pruning the changelog.

## How to prune a changelog

This means going through the auto generated changelog and fixing it up for customers to be able to read.

This could entail doing any or all of the following:

* Coupling entries that are for the same feature
  * Often we create multiple, small PRs for the one feature, if this is the case each changelog entry should be merged into a single changelog entry and all PRs should be linked.
* Breaking a changelog entry into multiple separate entries
  * If a PR went in that fixed two distinctly different tasks, the entry should be broken into two separate entries that both link back to the same PR.
* Fixing the purpose of a changelog entry if the meaning was unclear.
* Fixing up spelling and grammar

Ideally most of these are handled at PR time when the PR is reviewed. This reduces the work for whoever is creating the new release.

## Retroactively making changes to changelogs

_Can I go back and make changes to changelogs at any time? What about older versions?_

Yes! This is encouraged. If something in the changelog is unclear or wrong, no matter where it is in the changelog, definitely make a change to it and submit a PR.
