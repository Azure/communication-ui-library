// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const path = require('path');
const webpack = require('webpack');

const DEVELOPMENT_BUILD = process.env.NODE_ENV === 'development';
console.log(`Creating storybook with internal-only stories: ${DEVELOPMENT_BUILD}`);

// Include all stories that have .ts, .tsx or .mdx extensions in development builds.
const storybookDevGlobPaths = ['../stories/**/*.stories.@(ts|tsx|mdx)'];
// In production builds include all stories except those in the INTERNAL/ folder
const storybookProdGlobPaths = [
  '../stories/!(INTERNAL)/**/*.stories.@(ts|tsx|mdx)', // includes all stories in folders, *excluding* anything in the INTERNAL folder
  '../stories/*.stories.@(ts|tsx|mdx)' // includes all top level stories
];

module.exports = {
  stories: DEVELOPMENT_BUILD ? storybookDevGlobPaths : storybookProdGlobPaths,
  staticDirs: ['../public', '.'],
  // Speeds up webpack build time after every code change. Improvements of up
  // to 4-5 seconds can be seen. Comment if components don't render properly.
  typescript: { reactDocgen: 'react-docgen' },
  core: {
    builder: 'webpack5',
  },
  addons: [
    '@storybook/addon-links',
    {
      name: '@storybook/addon-essentials',
      options: {
        actions: false,
        controls: false,
        measure: false,
        outline: false,
        backgrounds: false
      }
    },
    '@storybook/addon-controls'
  ],
  features: {
    postcss: false,
  },
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
      '@internal/react-components': path.resolve(__dirname, '../../react-components/src'),
      '@internal/react-composites': path.resolve(__dirname, '../../react-composites/src'),
      '@internal/chat-stateful-client': path.resolve(__dirname, '../../chat-stateful-client/src'),
      '@internal/chat-component-bindings': path.resolve(__dirname, '../../chat-component-bindings/src'),
      '@internal/calling-stateful-client': path.resolve(__dirname, '../../calling-stateful-client/src'),
      '@internal/calling-component-bindings': path.resolve(__dirname, '../../calling-component-bindings/src'),
      '@internal/acs-ui-common': path.resolve(__dirname, '../../acs-ui-common/src'),
      '@internal/northstar-wrapper': path.resolve(__dirname, '../../northstar-wrapper/src'),
      '@internal/fake-backends': path.resolve(__dirname, '../../fake-backends/src')
    };

    return config;
  },
  managerWebpack: async (config, options) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@azure/communication-react': path.resolve(__dirname, '../../communication-react/src'),
      '@internal/react-components': path.resolve(__dirname, '../../react-components/src'),
      '@internal/react-composites': path.resolve(__dirname, '../../react-composites/src'),
      '@internal/chat-stateful-client': path.resolve(__dirname, '../../chat-stateful-client/src'),
      '@internal/chat-component-bindings': path.resolve(__dirname, '../../chat-component-bindings/src'),
      '@internal/calling-stateful-client': path.resolve(__dirname, '../../calling-stateful-client/src'),
      '@internal/calling-component-bindings': path.resolve(__dirname, '../../calling-component-bindings/src'),
      '@internal/acs-ui-common': path.resolve(__dirname, '../../acs-ui-common/src'),
      '@internal/northstar-wrapper': path.resolve(__dirname, '../../northstar-wrapper/src'),
      '@internal/fake-backends': path.resolve(__dirname, '../../fake-backends/src')
    };

    config.plugins.push(
      new webpack.DefinePlugin({
        __NPM_PACKAGE_VERSION__: JSON.stringify(require(path.resolve(__dirname, '../../communication-react/package.json')).version),
      })
    );

    return config;
  },
};
