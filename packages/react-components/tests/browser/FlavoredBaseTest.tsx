// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { test as base } from '@playwright/experimental-ct-react';
import { TestOptions } from '../../../../common/config/playwright/playwrightConfigConstants';

/**
 * The test function that should be used to skip tests for stable
 */
export const test = base.extend<TestOptions>({
  // Define an option and provide a default value.
  // This will be overridden in the config.
  isBetaBuild: [true, { option: true }]
});
