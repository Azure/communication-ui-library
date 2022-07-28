# Updating hero samples

## The hero samples

We maintain several hero sample GitHub repositories. These samples serve both as an easy example for folks to get started with the Azure Communication Services UI library and as a blueprint to integrate the library into their applications.

The hero samples are closely based on the sample applications in this repository:

| Hero sample               | monorepo sample                    |
| --                        | --                                 |
| [Chat][hero-chat]         | [samples/Chat][samples-chat]       |
| [Callling][hero-calling] | [samples/Calling][samples-calling] |

We refer to the samples in this monorepository as _upstream_ of the hero samples.

While the hero samples are based on the samples in this repository, there are some differences:

- The samples in this repository use the tooling required to work in a monorepository (`rush` etc.) whereas the hero samples use vanilla `npm`.
- The samples in this repository are intended to aid development of the library. Thus, they often use `beta` features of `@azure/communication-react` that are still under active development. In contrast, the hero samples only use `stable` features.
  - As a corollary, the upstream samples use [conditional compilation](../references/beta-only-features.md) to manage the the use of `beta` features. Conditional compilation is unnecessary, and not available, in the hero samples.

[hero-chat]: https://github.com/Azure-Samples/communication-services-web-chat-hero
[hero-calling]: https://github.com/Azure-Samples/communication-services-web-calling-hero
[samples-chat]: ../../samples/Chat/
[samples-calling]: ../../samples/Calling/


## When to update the hero samples

We typically update hero samples for two distinct reasons:

- To address any critical bugs in the hero sample.
  - The most common example of this are security issues discovered by [depandabot](https://github.com/dependabot) filed as GitHub issues on the hero sample repositories.
- To update the hero samples from the corresponding upstream samples.
  - Hero samples showcase the latest [stable release of `@azure/communication-react`](https://www.npmjs.com/package/@azure/communication-react).
  - We should update the hero samples from upstream every time we release a new stable version for `@azure/communication-react`, to showcase new features being shipped.


## How To: Fix critical issues

To fix any critical issues in the hero samples, including depandabot alerts in the hero sample repositories:

- First, fix the issue in the upstream sample.
- Then, port over just the fix to the hero sample.
  - Porting over the fix is a manual process. In most cases, this simply involves bumping version of package.json `dependencies`.


## How To: Update from upstream

Updating hero samples from upstream samples is a manual process. A combination of tooling in this monorepo and the suggested process below can minimize the toil from this manual process.

The description below uses [an example update](https://github.com/Azure-Samples/communication-services-web-chat-hero/pull/69) to the chat hero sample. Follow similar steps when updating the other hero samples.

- Pick the git commit in this monorepository to update from.
  - The default choice is to pick the git tag for the latest stable release. This ensures that the upstream sample is sync with the released `@azure/communication-react` version.
  - Sometimes, you may want to pick a later commit to pull in some useful updates to the sample. If doing so, make sure that the intervening commits do not introduce changes that are inconsistent with the latest stable release of `@azure/communication-react`.
  - For this example, we synced from [a541b2](https://github.com/Azure/communication-ui-library/tree/a541b2294943cdd4f885fdfc0ae60511f95c960a/samples/Chat). This was not the latest stable release, but the log of changes since the stable release showed only one very useful change:
  ```sh
  $ git log --oneline 1.3.0..a541b2 -- samples/Chat/src
  3c2b5410b Dispose of adapters in the `beforeUnload` in our Sample apps (#1966)
  ```

-