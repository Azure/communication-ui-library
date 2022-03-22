Can't speed up storybook build in anyway.

storybook ships its own webpack configuration / uses webpack under the hood.
Don't think thre is an (easy) escape hatch to use another bundler:
https://storybook.js.org/docs/react/api/cli-options

The best option is something like https://storybook.js.org/addons/storybook-addon-turbo-build/ use esbuild as a plugin to webpack for some heavy tasks. Not sure we should expect large perf improvements though.