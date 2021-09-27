// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as telemetryVersion from './telemetryVersion';

/**
 * @private
 */
// Removes long suffixes that don't fit the constraints for telemetry application ID.
// e.g., the build suffix is dropped for alpha package versions.
export const sanitize = (version: string): string => {
  const alphaIndex = version.search(/alpha/);
  if (alphaIndex >= 0) {
    return version.substring(0, alphaIndex + 5);
  }
  return version;
};

/**
 * Application ID to be included in telemetry data from the UI library.
 *
 * @internal
 */
export const _getApplicationId = (): string => {
  const version = telemetryVersion['default'];
  return sanitize(`acr/${version}`);
};
