// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import remarkGfm from 'remark-gfm';

const DEVELOPMENT_BUILD = process.env.NODE_ENV === 'development';
console.log(`Creating storybook with internal-only stories: ${DEVELOPMENT_BUILD}`);
// Include all stories that have .ts, .tsx or .mdx extensions in development builds.
const storybookDevGlobPaths = ['../stories/**/*.@(mdx)', '../stories/**/*.stories.@(ts|tsx)'];
// In production builds include all stories except those in the INTERNAL/ folder
const storybookProdGlobPaths = [
  '../stories/!(INTERNAL)/**/*.@(mdx)', // includes all stories in folders, *excluding* anything in the INTERNAL folder
  '../stories/*.@(mdx)', // includes all top level stories
  '../stories/!(INTERNAL)/**/*.stories.@(ts|tsx)', // includes all stories in folders, *excluding* anything in the INTERNAL folder
  '../stories/*.stories.@(ts|tsx)' // includes all top level stories
];
const storybookConfig: StorybookConfig = {
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-controls',
    { name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
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
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: { }
  },
  // Use this to remove stories if we don't want to show; name <NameOfStory>DocsOnly
  managerHead: (head) => `
  ${head}
  <style>div[data-item-id$="-docs-only"] { display: none; }</style>
  `,
  staticDirs: ['../public', '.'],
  stories: DEVELOPMENT_BUILD ? storybookDevGlobPaths : storybookProdGlobPaths,
  typescript: { reactDocgen: 'react-docgen' },
  webpackFinal: async (config) => {
    if (config.performance) {
      // Remove entrypoint size warning (rush build sees warnings as errors). Ideally we should use code splitting to reduce the entry point instead.
      // For more information on how this might be possible see: https://github.com/storybookjs/storybook/issues/6885
      config.performance.hints = false;
    }
    if (!config.resolve) {
      config.resolve = {};
    }

    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions
      })
    ];

    console.log(`Resolving packages to source files: ${DEVELOPMENT_BUILD}`);
    // Resolve local packages directly to the source files instead of module linking via node_modules.
    // This means props in the docs for each component can be directly retrieved from the component (we were seeing issues where props
    // did not show when referencing the dist/component.js file, these issues are fixed when referencing the src/component.ts typescript file).
    // Note: This triggers babel to re-transpile all package dependency files during webpack's compilation step.
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
      '@internal/fake-backends': path.resolve(__dirname, '../../fake-backends/src')
    };

    // Custom rule for ts files
    const tsRule = {
        test: /\.(tsx?|jsx?)$/,
        loader: 'ts-loader',
        options: {
            transpileOnly: true,
        },
    };

    const txtRule = {
        test: /\.txt$/,
        use: 'raw-loader',
    };

    return {
      ...config,
      module: { ...config.module, rules: [...(config.module?.rules || []), tsRule, txtRule] },
    };
  },
};

export default storybookConfig;