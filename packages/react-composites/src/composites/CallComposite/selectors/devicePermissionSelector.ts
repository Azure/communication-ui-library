// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DeviceManagerState } from '@internal/calling-stateful-client';
import * as reselect from 'reselect';
import { getDeviceManager } from './baseSelectors';

const selectDevicePermission = (deviceManager: DeviceManagerState) => {
  return {
    video: deviceManager.deviceAccess ? deviceManager.deviceAccess.video : undefined,
    audio: deviceManager.deviceAccess ? deviceManager.deviceAccess.audio : undefined
  };
};

/**
 * @private
 */
export const devicePermissionSelector = reselect.createSelector([getDeviceManager], selectDevicePermission);
