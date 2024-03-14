// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* eslint-disable @typescript-eslint/explicit-function-return-type */

import path from 'path';
import { rsbuildConfig as commonRsBuildConfig } from '../../../../common/config/rsbuild/sampleapp.rsbuild.config';
import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

/**
 * @returns {import('@rsbuild/core').RSBuildConfig}
 * @private
 */
export const testAppCommonRSBuildConfig = (appDir) => {
  const mergedConfig = mergeRsbuildConfig(
    commonRsBuildConfig(path.join(__dirname, '../../')),
    defineConfig({
      source: {
        entry: {
          index: path.join(appDir, 'index.tsx')
        }
      },
      tools: {
        htmlPlugin: {
          template: path.join(__dirname, 'index.html')
        }
      },
      output: {
        distPath: {
          root: path.join(appDir, 'dist')
        },
        copy: [
          { from: path.join(__dirname, 'fonts', 'segoeui-bold.woff2'), to: 'fonts' },
          { from: path.join(__dirname, 'fonts', 'segoeui-regular.woff2'), to: 'fonts' },
          { from: path.join(__dirname, 'fonts', 'segoeui-semibold.woff2'), to: 'fonts' },
          { from: path.join(__dirname, 'images'), to: 'images' },
          { from: path.join(__dirname, 'public', 'backgrounds'), to: 'backgrounds' }
        ],
        minify: false
      }
    })
  );

  return mergedConfig;
};
