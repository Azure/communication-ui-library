# api-extractor fork

In this repo we are currently making use of a fork of the api-extractor because of the following bug: <https://github.com/microsoft/rushstack/issues/1050>. This fork is built from <https://github.com/microsoft/rushstack/pull/1916> that fixes this issue. Once that PR is completed and a new version of api-extractor is published to npm with the fix, this fork should be removed.

To remove this fork simply delete this folder and update the api-extractor dependencies in each package.json to point to the new npm version.
