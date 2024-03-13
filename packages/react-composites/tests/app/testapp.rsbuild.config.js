// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* eslint-disable @typescript-eslint/explicit-function-return-type */

import path from 'path';
import { rsbuildConfig as commonRsBuildConfig } from '../../../../common/config/rsbuild/sampleapp.rsbuild.config';
import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core';

/**
 * @returns {import('@rsbuild/core').RSBuildConfig}
 * @private
 */
export const testAppCommonRSBuildConfig = (outputDir) =>
  mergeRsbuildConfig(
    commonRsBuildConfig,
    defineConfig({
      output: {
        distPath: {
          root: path.join(outputDir, 'dist')
        },
        copy: [
          { from: path.join(__dirname, 'fonts', 'segoeui-bold.woff2'), to: 'fonts' },
          { from: path.join(__dirname, 'fonts', 'segoeui-regular.woff2'), to: 'fonts' },
          { from: path.join(__dirname, 'fonts', 'segoeui-semibold.woff2'), to: 'fonts' },
          { from: path.join(__dirname, 'images'), to: 'images' },
          { from: path.join(__dirname, 'public', 'backgrounds'), to: 'backgrounds' }
        ]
      }
    })
  );
