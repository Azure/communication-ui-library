// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { test as base } from '@playwright/experimental-ct-react';

/**
 * Represents the option that should be used to skip tests for stable
 */
export type TestOptions = {
  isBetaBuild: boolean;
};

/**
 * The test function that should be used to skip tests for stable
 */
export const test = base.extend<TestOptions>({
  // Define an option and provide a default value.
  // This will be overridden in the config.
  isBetaBuild: [true, { option: true }]
});
