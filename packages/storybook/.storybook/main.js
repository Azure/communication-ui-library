// © Microsoft Corporation. All rights reserved.

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
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@azure/communication-ui": path.resolve(__dirname, "../../communication-ui/src")
    }

    return config;
  }
};
