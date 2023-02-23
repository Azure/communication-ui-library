# Where to add a dependency

`@azure/communication-react` [depends on several packages](../../packages/communication-react/package.json).
When adding a new dependency, you have to decide where to add it: `dependencies`, `devDependencies` or
`peerDependencies`.

`devDependencies` are the easiest -- any package only needed for development of our package (e.g. for unit tests), but
not by an application that uses @azure/communication-react go here.
See [official documentation from NPM](https://nodejs.dev/en/learn/an-introduction-to-the-npm-package-manager) for more details.

`peerDependencies` are useful for two purposes.

* To specify large or common packages that we work with (e.g. React), as described in the
  [official NPM blog](https://nodejs.org/en/blog/npm/peer-dependencies/) that introduced `peerDependencies`.
* To specify an Azure Communication Services dependency _that we wrap and re-export from our package_. Next section
  describes this in more detail.

Everything else goes into `dependencies`.

## ACS API re-exported from @azure/communication-react

There are two ACS packages currently that are specified as `peerDependencies` of `@azure/communication-react`.

* `@azure/communication-calling`
* `@azure/communication-chat`

These are specified as peer dependencies because we wrap a non-trivial part of their API and reexport it from
`@azure/communication-react`. To use this reexported API, clients must depend directly on the underlying SDKs for
types and related functions. Thus, objects created using `@azure/communication-react` must interoperate cleanly
with the direct SDK dependencies added by the client. Having two different versions of the SDKs (one installed by
the client application and one installed by `@azure/communication-react`) can break this requirement (it causes
problems in practice with `@azure/communication-calling`). Thus, we specify these packages as `peerDependencies` so
that the underlying SDKs are only installed once, to the version specified by the client application.

See [this article](https://indepth.dev/posts/1187/npm-peer-dependencies#the-guidelines) for a discussion of this
scenario.