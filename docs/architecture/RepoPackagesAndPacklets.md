# Packages and Packlets

## Packages vs Packlets

### Packages

Packages refer to the packages we release to npm. These are typically a meta package with no internal functionality but instead reexport a set of packlets.

List of current packages:
* `@azure/communication-react`

### Packlets

Packlets are internal-only libraries we use to ensure correct code seperation.

List of current Packlets:

* `@internal/calling-component-bindings`
* `@internal/calling-stateful-client`
* `@internal/chat-component-bindings`
* `@internal/chat-stateful-client`
* `@internal/react-components`
* `@internal/react-composites`

## Dependency chain issues when building Packages

Our packages and packlets often reference other packlets, e.g.

```javascript
// @internal/react-components/mycomponent.ts
import { fn } from '@internal/component-binding';
```

When this is transpiled the resultant javascript output will remain unchanged:

```javascript
// @internal/react-components/mycomponent.ts
import { fn } from '@internal/component-binding';
```

Now if an external user was to consume this transpiled output from an npm package, their build system will try to import `fn` from `'@internal/component-binding'` - but that package doesn't exist as an npm package so their build system will break.

To solve this issue we make use of [ts-transform-paths](../infrastructure/ttypescript-plugins#zerollupts-transform-paths).

### How this tool solves the issue

As an example, the output contents of the `@azure/communication-react` package when built may look like:

```text
/dist/dist-esm/react-components/index.js
/dist/dist-esm/react-components/mycomponent.js
/dist/dist-esm/component-binding/index.js
/dist/dist-esm/component-binding/utils.js
```

Therefore, we want the import line from before:

```javascript
import { fn } from '@internal/component-binding';
```

to instead have a relative path to the correct file in the dist directory:

```javascript
import { fn } from '../component-binding';
```

This tool correctly rewrites the import lines to ensure they have the correct relative path.

## Treeshaking

To ensure packlets are not referencing unintended modules or other packlets, we use a [check-treeshaking](https://github.com/Azure/communication-ui-library/tree/main/tools/check-treeshaking) tool.
