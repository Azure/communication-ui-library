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
 * @internal
 */
export type TelemetryImplementationHint = 'Call' | 'Chat' | 'CallWithChat' | 'StatefulComponents';

/**
 * @private
 *
 * Takes a telemetry implementation hint and returns the numerical value.
 */
const getTelemetryImplementationHint = (telemetryImplementationHint?: TelemetryImplementationHint): number => {
  switch (telemetryImplementationHint) {
    case 'Call':
      return 1;
    case 'Chat':
      return 2;
    case 'CallWithChat':
      return 3;
    case 'StatefulComponents':
      return 4;
    default:
      return 0;
  }
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
export const _getApplicationId = (telemetryImplementationHint?: TelemetryImplementationHint): string => {
  const highLevelArtifact = 0;
  const specificImplementation = getTelemetryImplementationHint(telemetryImplementationHint);
  const implementationDetails = 0;
  const version = telemetryVersion['default'];
  return sanitize(`acr${highLevelArtifact}${specificImplementation}${implementationDetails}/${version}`);
};
