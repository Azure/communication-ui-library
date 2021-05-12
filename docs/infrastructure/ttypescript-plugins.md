# ttypescript

[ttypescript](https://github.com/cevek/ttypescript) is an extension on top of typescript (`tsc`) that allows for plugins.

To run using ttypescript instead of typescript run

```bash
ttsc #ttypescript
```

instead of

```bash
tsc #typescript
```

## Plugins

ttypescript plugins currently used in this repo:

### [@zerollup/ts-transform-paths](https://github.com/zerkalica/zerollup/tree/master/packages/ts-transform-paths)

`ts-transform-paths` is used to correctly transform the import statements inside of the `@azure/communication-react` package.

#### Configuration

Imports to be transformed are configured in the `tsconfig.json` file. The `ts-transform-paths` tool uses the `paths` property in the tsconfig to know the appropriate transformation.

#### Why this is needed

Our internal packages may reference other internal packages, e.g.

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

#### How this tool solves the issue

As an example, the output contents of the `@azure/communication-react` package produced in this repo may look like:

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
