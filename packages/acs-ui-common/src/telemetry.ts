// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as telemetryVersion from './telemetryVersion';

export type Composite = 'call' | 'chat' | 'callWithChat';

/**
 * Application ID to be included in telemetry data from the UI library.
 *
 * @internal
 */
export const _getApplicationId = (composite?: Composite): string => {
  const version = telemetryVersion['default'];
  return _getApplicationIdImpl(version);
};

/** @private */
export const _getApplicationIdImpl = (version: string, composite?: Composite): string =>
  sanitize(`acr${infix(composite)}/${version}`);

const infix = (composite?: Composite): string => {
  switch (composite) {
    case 'call':
      return '11';
    case 'chat':
      return '12';
    case 'callWithChat':
      return '13';
    default:
      return '';
  }
};

// Removes long suffixes that don't fit the constraints for telemetry application ID.
// e.g., the build suffix is dropped for alpha package versions.
const sanitize = (version: string): string => {
  const alphaIndex = version.search(/alpha/);
  if (alphaIndex >= 0) {
    return version.substring(0, alphaIndex + 5);
  }
  return version;
};
