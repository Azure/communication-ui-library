# Import Transformer

This tool is used in this repo to rewrite the import and require lines in the build files of the meta package.

## Configuration

In the directory this is called there should be a importTranform.config.js.
The following options are supported:

```javascript
module.exports = {
  // Array of folder roots to perform the transform from
  // e.g. ['dist/dist-esm', 'dist/dist-cjs']
  buildFolderRoots: [],

  // Mapping of internal package names to desired folder name
  // e.g. { '@azure/acs-chat-selector': 'acs-chat-selector/src' }
  packageTranslations: {}
}
```

## Why this is needed

This is needed because our internal packages may reference other internal packages, e.g.

```javascript
// @internal/react-components/mycomponent.ts
import { fn } from '@internal/component-binding';
```

When this is transpiled the resultant javascript output will remain unchanged:

```javascript
// @internal/react-components/mycomponent.ts
import { fn } from '@internal/component-binding';
```

Now if an external user was to consumer this transpiled output from an npm package, their build system will try to import `fn` from `'@internal/component-binding'` - but that package doesn't exist as an npm package so their build system will break.

## How this tool solves the issue

An example contents of a meta package produced in this repo may look like:

```text
/dist/dist-esm/react-components/index.js
/dist/dist-esm/react-components/mycomponent.js
/dist/dist-esm/component-binding/index.js
/dist/dist-esm/component-binding/utils.js
```

Therefore, we would want the import line from before:

```javascript
import { fn } from '@internal/component-binding';
```

to instead look like:

```javascript
import { fn } from '../component-binding';
```

This tool recursively checks all import and require lines in all files and updates them to match the expected relative path - replacing the import from the internal project name.
