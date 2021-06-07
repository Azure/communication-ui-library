# Rollup

## What is Rollup?

[Rollup](https://rollupjs.org/guide/en/) is a bundler similar to webpack that we use to create CommonJS bundles for each npm package. This allows us to create a hybrid npm package - one that supports both ESM and CommonJS formats.

## What does Rollup do

We are using Rollup to transform our ESM (EcmaScript Module) output that the tsc build produces. It takes the `/dist/dist-esm/index.js` produced by tsc and transforms and flattens the output to a single `/dist/dist-cjs/index.js` CommonJS module file.

### When is Rollup Run

Rollup is run as part of each packages build step.

## ESM vs CommonJS vs AMD vs UMD

For some background context there are three main module formats: [ESM (EcmaScript Modules)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), [CommonJS](https://en.wikipedia.org/wiki/CommonJS) and [AMD (Asynchronous Module Definition)](https://en.wikipedia.org/wiki/Asynchronous_module_definition). [UMD](https://github.com/umdjs/umd) is a universal way of supporting both CommonJS and AMD (but not ESM).

CommonJS and AMD both need the `require` syntax, e.g.,

```javascript
// Example CommonJS/AMD module import syntax
const pkg = require("pkg");
pkg.function1();
```

ESM uses the `import ... from ...` syntax and has a number of advantages such as better treeshaking.

```javascript
// Example ESM module import syntax
import { function1, function2 } from "pkg";
function1();
```

### Why support both ESM and CommonJS

ESM is relatively new and is slowly being adopted as the standard. It is supported in all major browsers (except IE) and in Node v13.2.0+ ([view support here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#browser_support)).

However, to support Node versions < v.13.2.0 (for unit testing) and enable consumers of the package to make a choice for what they wish to support we have decided to support both ESM and CommonJS. At the time of writing we do not support AMD/UMD.

## Configuration Files

The configuration file for rollup can be found under each project root and is called `rollup.config.js`. E.g., [packages/react-components/rollup.config.js](https://github.com/Azure/communication-ui-library/blob/main/packages/react-components/rollup.config.js).
