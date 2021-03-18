# Linting

This repo uses [ESLint](https://eslint.org/) for linting alongside [Prettier](https://prettier.io/) for automatic style enforcement.

## What is ESLint?

[ESLint](https://eslint.org/) is a static code analyzer that helps protect against coding anti-patterns and help highlight issues in code before they become bugs. It also enforces styling that can't be auto-fixed by prettier.

### ESLint commands

To run linting across the whole repo run: `rush lint`. You can also run `rush lint:fix` to auto fix issues. To run these locally in the package you are working in simply run `rushx lint` and `rushx lint:fix` in the package or sample directory.

### ESLint vscode extension

We highly recommend installing the vscode ESLint extension: <https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint>.

### ESLint rules

To view the linting rules see the `.eslintrc.js` file in each project directory.

## What is Prettier

[Prettier](https://prettier.io/) is code style enforcing tool. This is run every time you make a commit and auto styles your code.

### Prettier rules

Unlike eslint, which has rules per package, we enforce consistent styling across the whole repo. The config file `.prettierrc` can be found under the root of the repo.
