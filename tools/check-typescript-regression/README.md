# Typescript Regression Checker

This tool tries to run `tsc` over the npm package, to ensure that the typescript definitions are supported in our minimum typescript version.

For example, `typescript` may add new syntax that is not supported in our minimum typescript version and we may expose that in the `.d.ts` type file of our npm package. This tool will catch that.

If this project fails, it should only be because typescript definitions were added that are not compatible with our minimum typescript version and you likely need to use an older typescript syntax.
