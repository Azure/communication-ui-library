// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// TODO: Find a way to import version from ../package.json
// This package is rooted at acs-ui-common/src so acs-ui-common/package.json is not accessible.
const version = '0.0.0-alpha';

export const sanitize = (version: string): string => {
  const alphaIndex = version.search(/alpha/);
  if (alphaIndex >= 0) {
    return version.substring(0, alphaIndex + 5);
  }
  return version;
};

/**
 * Application ID to be included in telemetry data from the UI library.
 */
export const getApplicationId = (): string => sanitize(`acr/${version}`);
