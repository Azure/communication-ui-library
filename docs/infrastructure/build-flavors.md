# Build Flavors

## The problem

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

## Tooling support




build / test cycle.

* Both flavors are built into `dist` (overwrite each other).
  * Gotcha: `rush build:stable` followed by `rushx build` (or vice-versa)
  * Gotcha: `rush build` followed by `rush build:stable`?


e2e tests.

New package.json scripts
The only difference is env-vars being set for webpack
* snapshots are stored in a different folder (again controlled by envvar set from package.json script)

* Gotcha: If you build `rush build:e2e:stable` then `rush test:e2e`.
  * Similar to existing problem of build -> test.


webpack configs:

  samples/Calling, samples/Chat, react-composites/tests/*/app, samples/StaticHtmlComposites, samples/ComponentExamples

  * set envvar to add extra webpack plugin
    * No `preprocess` folder, in-memory extra webpack pass.

samples/Server
  * No `stable` support yet (don't need it).

storybook:
  * Always built off of beta API, no separate `stable` support
  * Must call out "preview" features
  * (TODO: Can we enforce this?) Snippets for "preview" features should be kept separate from stable features, and marked as such.

## CI support



### TODO

* Separate checked-in API files / folder generation
* Add `rushx:lint` and `rush:lint`
* [Nice to have] Can we remove helper scripts from `package.json` -- `copy-original`, `preprocess`, `preprocess:stable`.
* Merge `clean` with `clean:preprocess`.
* Replace `rush build:stable` with `rush rebuild:stable` (no incremental).
  * Remove `paths` from `tsconfig.preprocess.json` (so we follow `rush` setup).
* Explore other ways to run `stable` flavor commands
  * Pass in `--stable` to `rushx` (and `rush`?) commands?
  * Using env-var instead of separate package.json scripts.
* Make sure all samples have `rushx start:stable`.



* Automation:
  * CI: add build:stable, test:stable, lint:stable, test:e2e:*
  * Add stable vs beta branch creation

  * Add stable vs beta package release
    * Just do `rush build:stable` then `npm pack`.

### different depenedencies for stable vs beta

### Release channels

stable-channel : 1.0.0
beta-channel   : 1.0.1-beta.1             1.1.0-beta.1                1.1.1-beta.1       1.1.1-beta.2       1.1.1-beta.3          1.1.2-beta.1          1.2.1-beta.1
                          Added API1 to stable        Bug fix1 to stable     Bugfix2 to beta       API2 to beta       Stabilize bugfix2      Stabilize API2
More releases >
stable-channel : 1.0.0                                    1.1.0
beta-channel   : 1.0.1-beta.1             1.1.0-beta.1    1.1.1-beta.1       1.1.1-beta.1       1.1.1-beta.2       1.1.1-beta.3          1.1.2-beta.1          1.2.1-beta.1

stable-channel : 1.0.0                                                             1.1.1
beta-channel   : 1.0.1-beta.1             1.1.0-beta.1                1.1.1-beta.1 1.1.2-beta.1 1.1.2-beta.2       1.1.2-beta.3          1.1.3-beta.1          1.2.1-beta.1


* changelog

* How do stable releases work?
  * Find tag for beta version to release to stable.
  * Create a stable release branch off of that.
  * *If* there are no none-`none` changes in `main`, then when merginging the stable branch back, add a `patch` change to `main`.
    * Should we do a beta release then?

* We want to bump versions *only* when changes are going into stable.
  * Adding an API that is excluded from stable, _does not_ bump versions (that's a `none` change type).
  * When this API is included in stable, that's when we bump verion.
