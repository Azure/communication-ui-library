# Packages and Packlets

## Packages vs Packlets

### Packages

Packages refer to the packages we release to npm. These are typically a meta package with no internal functionality but instead reexport a set of packlets.

List of current packages:
* `@azure/communication-react`

### Packlets

Packlets are internal-only libraries we use to ensure correct code seperation.

List of current Packlets:

* `@azure/acs-calling-selector`
* `calling-stateful-client`
* `@azure/acs-chat-selector`
* `chat-stateful-client`
* `react-components`
* `react-composites`

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

## Treeshaking

To ensure packlets are not referencing unintended modules or other packlets, we use a [check-treeshaking](https://github.com/Azure/communication-ui-sdk/tree/main/packages/check-treeshaking) tool.
