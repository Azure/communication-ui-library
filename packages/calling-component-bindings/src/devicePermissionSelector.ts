// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// @ts-ignore
import * as reselect from 'reselect';
// @ts-ignore
import { CallClientState, DeviceManagerState } from 'calling-stateful-client';
// @ts-ignore
import { getDeviceManager } from './baseSelectors';

export const devicePermissionSelector = reselect.createSelector([getDeviceManager], (deviceManager) => {
  return {
    video: deviceManager.deviceAccess ? deviceManager.deviceAccess.video : true,
    audio: deviceManager.deviceAccess ? deviceManager.deviceAccess.audio : true
  };
});
