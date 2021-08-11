// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { version } from '../package.json';

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
