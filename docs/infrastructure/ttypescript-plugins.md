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

Currently this plugin is used to fix incorrect import lines when packlets have downstream dependencies on other packlets.

For more information on this issue see: [dependency-chain-issues-when-building-packages](../architecture/RepoPackagesAndPacklets.md#dependency-chain-issues-when-building-packages)
