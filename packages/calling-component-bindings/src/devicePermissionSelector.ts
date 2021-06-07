// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import { getDeviceManager } from './baseSelectors';

export const devicePermissionSelector = reselect.createSelector([getDeviceManager], (deviceManager) => {
  return {
    video: deviceManager.deviceAccess ? deviceManager.deviceAccess.video : true,
    audio: deviceManager.deviceAccess ? deviceManager.deviceAccess.audio : true
  };
});
