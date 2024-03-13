// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { defineConfig } from '@rsbuild/core';
import { testAppCommonRSBuildConfig } from '../testapp.rsbuild.config';

export default defineConfig(testAppCommonRSBuildConfig(__dirname));
