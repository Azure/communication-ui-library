// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const path = require('path');

module.exports = {
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(ts|tsx)'],
  // Speeds up webpack build time after every code change. Improvements of up
  // to 4-5 seconds can be seen. Comment if components don't render properly.
  typescript: { reactDocgen: 'react-docgen' },
  addons: [
    '@storybook/addon-links',
    {
      name: '@storybook/addon-essentials',
      options: {
        actions: false,
        controls: false
      }
    },
    '@storybook/addon-knobs'
  ],
  webpackFinal: async (config, { configType }) => {
    // Remove entrypoint size warning (rush build sees warnings as errors). Ideally we should use code splitting to reduce the entry point instead.
    // For more information on how this might be possible see: https://github.com/storybookjs/storybook/issues/6885
    config.performance.hints = false;

    // Resolve local packages directly to the source files instead of module linking via node_modules.
    // This means props in the docs for each component can be directly retrieved from the component (we were seeing issues where props
    // did not show when referencing the dist/component.js file, these issues are fixed when referencing the src/component.ts typescript file).
    // Note: This triggers babel to retranspile all package dependency files during webpack's compilation step.
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@azure/communication-react': path.resolve(__dirname, '../../communication-react/src'),
      'react-composites': path.resolve(__dirname, '../../react-composites/src'),
      'chat-stateful-client': path.resolve(__dirname, '../../chat-stateful-client/src'),
      'chat-component-bindings': path.resolve(__dirname, '../../chat-component-bindings/src'),
      'calling-stateful-client': path.resolve(__dirname, '../../calling-stateful-client/src'),
      'calling-component-bindings': path.resolve(__dirname, '../../calling-component-bindings/src'),
      'acs-ui-common': path.resolve(__dirname, '../../acs-ui-common/src')
    };

    return config;
  }
};
