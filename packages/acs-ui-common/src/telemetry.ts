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
 * Template: acXYYY/<version>
 * Where:
 * - X describes a platform, [r: web, i: iOS, a: Android]
 * - YYY describes what's running on this platform (optional, currently unused by this library):
 *    Y[0] is high-level artifact,
 *      [0: undefined, 1: AzureCommunicationLibrary, 2: ACS SampleApp]
 *    Y[1] is specific implementation,
 *      [0: undefined, 1: Call Composite, 2: Chat Composite, 3: CallWithChatComposite, 4: UI Components]
 *    Y[2] is reserved for implementation details,
 *      [0: undefined]
 *
 * @internal
 */
export const _getApplicationId = (): string => {
  const version = telemetryVersion['default'];
  return sanitize(`acr/${version}`);
};
