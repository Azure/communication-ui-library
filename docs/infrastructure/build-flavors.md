# Build Flavors

We release the `@azure/communication-react` package on NPM on two _channels_.

* Stable channel: These use stable SemVer versions, tagged as `latest` on NPM: `1.0.0`, `1.0.1`, `1.2.1` etc.
* Beta channel: These use `-beta.*` SemVer versions, tagged as `next` on NPM: `1.0.0-beta.1`, `1.0.1-beta.1`, `1.2.1-beta.2` etc.

We release on the two channels somewhat independently: For each stable channel release, there is a corresponding beta channel release that is a super-set of the stable channel package. But the beta channel release may contain extra features (including some they may not be released in the next stable release either) and may contain updated package dependencies.

We release on both channels from `main`. Thus, we must be able to build two flavors of the package from `main`:

* all-inclusive flavor: Contains all features, more up-to-date, potentially beta-versioned package dependencies.
* stable flavor: Contains only stabilized features, only stable package dependencies.

Additionally, we must be able to test both these flavors, build samples for both these flavors, document both these flavors...

## Conditional Compilation

We resolve this problem via conditional compilation. Any code that should be included only for beta builds can be marked as such with a special comment:

```ts
  /* @conditional-compile-remove-from(stable) */
```
or
```ts
  /* @conditional-compile-remove-from(stable) my-funky-feature */
```

The latter form is with a trailing tag is recommended to identify all conditional compilation blocks related to a single feature. It can make it easier to enable those blocks for the stable build when the feature stabilizes. The trailing tag is not parsed in any way by the tools / automation we use.

The conditional compilation tag can be used in the following ways:

* Conditional type, interface or field declaration:

  ```ts
  /* @conditional-compile-remove-from(stable) my-funky-feature */
  export type MyFunkyFeatureId = string;

  /* @conditional-compile-remove-from(stable) my-funky-feature */
  interface MyFunkyFeatureProps {
    id: MyFunkyFeatureId;
  }


  interface StableProps {
    /* @conditional-compile-remove-from(stable) my-funky-feature */
    funkyFeatureId: MyFunkyFeatureId;
  }
  ```
  Above, the type `MyFunkyFeatureId`, interface `MyFunkyFeatureProps` and the field `funkyFeatureId` are
  all removed from stable flavored build.

* Conditional imports and exports:

  ```ts
  /* @conditional-compile-remove-from(stable) my-funky-feature */
  import * from MyFunkyFeature;
  /* @conditional-compile-remove-from(stable) my-funky-feature */
  export * from MyFunkyFeature;
  ```

* Conditional function definition:

  ```ts
  /* @conditional-compile-remove-from(stable) my-funky-feature */
  const FunkyFeature = (props: FunkyFeatureProps): JSX.Element => {
      return <span>Funkkkkkyyyyyyy</span>
  }

  /* @conditional-compile-remove-from(stable) my-funky-feature */
  function areFunkyPropsDefined(props: FunkyFeatureProps): boolean {
      return props !== undefined;
  }
  ```

* Conditional expressions:

  ```ts
  const AllFeatures = (): JSX.Element => {
      return (
          <>
            <NormalFeature/>
            /* @conditional-compile-remove-from(stable) my-funky-feature */
            <FunkyFeature/>
          </>
      );
  }
  ```

  The use of conditional expressions should be avoided as much as possible, as it hurts readability of code, and makes it harder to stabilize conditionally compiled code. Prefer to extract functions to encapsulate conditioncally compiled logic like above.

### Separate package dependencies

    TODO: Open question on how we'll have separate version of package dependencies.


## Tooling

During development, you should consider the all-inclusive build flavor as the primary target. For example, your code editor will not recognize the conditional compilation tags specially and thus show build / lint hints for the all-inclusive flavor.

For developing beta-only features, the recommended approach is:

* First, using the default all-inclusive tooling to iterate on the all-inclusive build.
* Then, use the stable flavored tooling to make sure your feature does not affect the stable build unintentionally.

The following commands have

<table>
<thead>
  <tr>
    <td>Action</td>
    <td>All-inclusive flavored commands(s)</td>
    <td>Stable flavored command(s)</td>
    <td>Notes</td>
  </tr>
</thead>

<tbody>
  <tr>
    <td>Build packages</td>
    <td>
      <code>rushx build</code>
      <br/><code>rush build</code>
      <br/><code>rush rebuild</code>
    </td>
    <td>
      <code>rushx build:stable</code>
      <br/><code>rush build:stable</code>
      <br/><code>rush rebuild:stable</code>
    </td>
    <td>
      It is dangerous to mix the all-inclusive and stable build commands. You <em>must</em> run <code>rush rebuild</code> or <code>rush rebuild:stable</code> when switching build flavors. Further details below.
    </td>
  </tr>
  <tr>
    <td>Run unit-tests</td>
    <td>
      <code>rushx test</code>
      <br/><code>rush test</code>
    </td>
    <td>
      <code>rushx test:stable</code>
      <br/><code>rush test:stable</code>
    </td>
    <td>
      As with building packages, you <em>must</em> run <code>rush rebuild</code> or <code>rush rebuild:stable</code> when switching build flavors. Further details below.
    </td>
  </tr>
  <tr>
    <td>Run e2e tests</td>
    <td>
      packages/react-composites: <code>rushx build:e2e:chat && rushx test:e2e:chat</code> etc.
      <br/>samples/tests: <code>rushx build:e2e:bundle && rushx test:e2e:bundle</code> etc.
    </td>
    <td>
      packages/react-composites: <code>rushx build:e2e:chat:stable && rushx test:e2e:chat:stable</code> etc.
      <br/>samples/tests: <code>rushx build:e2e:bundle:stable && rushx test:e2e:bundle:stable</code> etc.
    </td>
    <td>
      Even without build flavors, you <em>must</em> always build the sample apps used by the tests to include any changes made to the bundled code. Same applies to testing different build flavours -- always build the e2e app before running tests to make sure you are testing the right flavor.
    </td>
  </tr>
  <tr>
    <td>Update e2e test snapshots</td>
    <td><code>rushx update:e2e</code></td>
    <td><code>rushx update:e2e:stable</code></td>
    <td>
      Unlike build artifacts, snapshots for all-inclusive and stable flavored builds are stored separetely so that we can compare against golden files for both flavors. These commands update the corresponding set of snapshots.
    </td>
  </tr>
  <tr>
    <td>Run sample apps</td>
    <td><code>rushx start</code></td>
    <td><code>rushx start:stable</code></td>
    <td>
      This works for the following sample apps:
      <ul>
        <li>samples/Calling</li>
        <li>samples/Chat</li>
        <li>samples/ComponentExamples</li>
        <li>samples/StaticHtmlComposites</li>
      </ul>
      Only the all-inclusive flavor is supported for samples/Server at this time (because there is no need for a stable flavored build yet).
    </td>
  </tr>
</tbody>
</table>


* Both the all-inclusive and stable flavored builds use the same `dist` folder for build artifacts. This allows us to effectively use `rush`'s packlet linking and `npm pack` for both flavors. But this creates the opportunity for incorrectly linking packlets built with different flavors.
    * To avoid using the incorrect flavor of a packlet during incremental build or test, always run `rush rebuild` or `rush rebuild:stable` before using any of the following: `rushx build`, `rushx build:stable`, `rushx test`, `rushx test:stable`, `rush build`, and `rush build:stable`.

* The all-inclusive and stable flavored builds generate _separate_ API review files. This allows us to separately review API changes going into the beta and stable channels.

        TODO: ^^ is not yet implemented.

* The sample apps (including those used by e2e tests) also use the same output folder for different build flavors. Thus, you must build the right flavor of the app to test: `rushx build:e2e:chat && rushx test:e2e:chat` or `rushx build:e2e:chat:stable && rushx test:e2e:chat:stable`.

* The sample apps are served via `webpack`. `rushx start:stable` simply adds a `webpack` preprocessing pass via a plugin. Thus, hot-reloading works for `rushx start:stable` (and of course for `rushx start`) for changes to the sample apps and to any of the internal packlets.

* Storybook _only has the all-inclusive flavor_. Storybook is used to document all our API / components, including those in beta. Our stories should clearly document what features are in beta. We should additionally clearly mark code snippets that depend on beta-API because there might be breaking API changes affective those code snippets.
  * We currently do not have any tooling to check that beta-API is clearly flagged in storybook content.


## CI

    TODO: This section talks about stuff that doesn't yet exist.

Our continuous integration actions include building and testing code for both the all-inclusive and stable flavors. Effectively, CI builds, tests and lints the code for the all-inclusive and stable flavors.

CI also enforces `prettifier` formatting on the code, but only for the all-inclusive flavor, because the the formatting across the two flavors may be inconsistent, and editor support for formatting can only work with the all-inclusive flavor.


## Releases

    TODO: Some open questions here still being ironed out, regarding:
        * Version tracking on stable vs beta branches
        * Automated changelog generation, separate changelog for stable vs beta branches
        * Automated stable and beta branch creation
        * Automated stable and beta package release