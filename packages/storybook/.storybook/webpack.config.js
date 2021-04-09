// © Microsoft Corporation. All rights reserved.
require('../../../common/release/ts-node-register');
const { MonorepoResolvePlugin } = require("./MonorepoResolvePlugin");

module.exports = ({ config }) => {
  // Remove entrypoint size warning (rush build sees warnings as errors). Ideally we should use code splitting to reduce the entry point instead.
  // For more information on how this might be possible see: https://github.com/storybookjs/storybook/issues/6885
  config.performance.hints = false;

  config.resolveLoader.plugins = [
    // map local package imports like '@azure/communication-ui' imports straight to the src folder
    new MonorepoResolvePlugin(),
    ...(config.resolveLoader.plugins || [])
  ]

  return config;
};
