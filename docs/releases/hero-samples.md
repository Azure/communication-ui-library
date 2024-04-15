# Hero samples

We maintain several hero sample GitHub repositories. These samples serve both as an easy example for folks to get started with the Azure Communication Services UI library and as a blueprint to integrate the library into their applications.

The hero samples are closely based on the sample applications in this repository:

| Hero sample                        | monorepo sample                         |
| --                                 | --                                      |
| [Chat][hero-chat]                  | [samples/Chat][samples-chat]            |
| [Callling][hero-calling]           | [samples/Calling][samples-calling]      |

We refer to the samples in this monorepository as _upstream_ of the hero samples.

While the hero samples are based on the samples in this repository, there are some differences:

- The samples in this repository use the tooling required to work in a monorepository (`rush` etc.) whereas the hero samples use vanilla `npm`.
- The samples in this repository are intended to aid development of the library. Thus, they often use `beta` features of `@azure/communication-react` that are still under active development. In contrast, the hero samples only use `stable` features.
  - As a corollary, the samples here use [conditional compilation](../references/beta-only-features.md) to manage the the use of `beta` features. Conditional compilation is unnecessary, and not available, in the hero samples.

[hero-chat]: https://github.com/Azure-Samples/communication-services-web-chat-hero
[hero-calling]: https://github.com/Azure-Samples/communication-services-web-calling-hero
[samples-chat]: ../../samples/Chat/
[samples-calling]: ../../samples/Calling/

## When to update the hero samples

You should typically update hero samples for two distinct reasons:

- To address any critical bugs in the hero sample.
  - The most common example of this are security issues discovered by [depandabot](https://github.com/dependabot) filed as GitHub issues on the hero sample repositories.
- To update the hero samples from the corresponding upstream samples.
  - Hero samples showcase the latest [stable release of `@azure/communication-react`](https://www.npmjs.com/package/@azure/communication-react).
  - You should update the hero samples from upstream every time we release a new stable version for `@azure/communication-react`, to showcase new features being shipped.


## How To: Fix critical issues

To fix any critical issues in the hero samples, including depandabot alerts in the hero sample repositories:

- First, fix the issue in the upstream sample.
- Then, port over just the fix to the hero sample.
  - Porting over the fix is a manual process. In most cases, this simply involves updating the version of a package.json `dependencies` entry.
  - The GitHub PR template for hero samples includes a section to add upstream PR references. Link to the upstream PR in this section.


## How To: Update from upstream

Updating hero samples from upstream samples is a manual process. You can minimize the toil by following the process recommended in this section.

This section uses [an update to the chat hero sample](https://github.com/Azure-Samples/communication-services-web-chat-hero/pull/69) as an example. Follow similar steps when updating the other hero samples.

- Pick the git commit in this monorepository to update from.
  - Pick the git tag for the latest stable release. This ensures that the upstream sample is consistent with the released `@azure/communication-react` version.

- Generate a new source directory from the upstream sample.
  - In this monorepository,
    ```
    cd samples/Chat
    rushx port-sample
    ```
- This will generate a `samples/Chat/sample-dist` directory which contains the updates to src, Media, public directories in `samples/Chat/`, but conditionally compiled for the `stable` build flavor and prettified.

- Replace the hero sample sources.
  - Create a new branch in the chat hero sample repo.
  - Replace `Chat/src` with the generated `samples/Chat/sample-dist/src` from the directory we generated in the previous step.
  - Replace `Chat/Media` with the generated `samples/Chat/sample-dist/Media` from the directory we generated in the previous step.
  - Replace `Chat/public` with the generated `samples/Chat/sample-dist/public` from the directory we generated in the previous step.
  - Create a draft Pull Request against `main`.
    - Link to the source git commit in upstream that you generated the sources from. [Example PR description](https://github.com/Azure-Samples/communication-services-web-chat-hero/pull/69).

- Manually fix the generated source.
  - Use the draft Pull Request created in the last step to scan over the diff introduced by copying the sources from upstream. Review the draft PR yourself to point out all issues at once.
    - See the [comments in the example PR]((https://github.com/Azure-Samples/communication-services-web-chat-hero/pull/69)) for inspiration.
  - Some issues you discover should be fixed both in the hero sample and upstream to prevent the problems from arising in the next sync.
    - For example, I discovered and fixed some [missing conditional compilation directives](https://github.com/Azure/communication-ui-library/pull/2132) and some [references to `@internal/*` packlets](https://github.com/Azure/communication-ui-library/pull/2133) while reviewing the example PR.
  - There are a small set of manual fixes that are unavoidable and must be done each time you update the hero sample from upstream. [A later section](#list-of-manual-fixes) lists these fixes for each hero sample. Keep that section up to date for future reference.

- Reconcile `Chat/package.json`. This step is also manual and somewhat non-obvius.
  - The `dependencies` should mostly match between upstream and hero samples. A recommended approach to update `dependencies` is:
    - Add all `dependencies` from upstream to the hero sample, under the exising `dependencies`.
    - Sort alphabetically. This will bring identical keys together.
    - Pick the more recent version of the matching keys.
      - Exception: for `@azure/communication-react` and its peer dependencies `@azure/communication-chat` and `@azure/communication-calling`, pick the stable versions.
    - Remove all references to `@internal/*` packlets.
  - `devDependencies` should stay mostly unchanged. Upstream has a lot more entries here to support the monorepository tooling that are unnecessary in the hero sample. Check if any unit-testing related depenedencies should be updated.
  - Run `npm run setup` and commit the updated NPM lockfiles.

- Test the hero sample.
  - Populate appsettings, `npm run start` and smoke test the application.
  - `cd Chat && npm run lint`


### List of manual fixes

#### Chat hero sample

- Remove webpack injected globals and their use. [Exmple commit](https://github.com/Azure-Samples/communication-services-web-chat-hero/pull/69/commits/428bebd38de26678ecdede16051bcd309e4cadff).

#### Call hero sample

- Remove webpack injected globals and their use. [Example commit](https://github.com/Azure-Samples/communication-services-web-calling-hero/pull/154/commits/6d3a2854bdef06bc8304d6c11ad086facb8c4286)

## Hero sample releases

Whenever you update a hero sample, consider creating a new "release". The release bundles up the sample application and makes it available for the one-click deploy off of the sample README. As this one-click deploy is likely to be the first experience folks have with Azure Communication Services, it is important that it works smoothly and shows off the best features we have to offer!

* [Chat](https://github.com/Azure-Samples/communication-services-web-chat-hero/releases)
* [Calling](https://github.com/Azure-Samples/communication-services-web-calling-hero/releases)

![image](https://user-images.githubusercontent.com/82062616/199340693-634f7a6f-c066-40ad-a2fd-b32f2523238c.png)
