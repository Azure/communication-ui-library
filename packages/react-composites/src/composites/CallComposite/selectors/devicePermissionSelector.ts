// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import { getDeviceManager } from './baseSelectors';

/**
 * @private
 */
export const devicePermissionSelector = reselect.createSelector([getDeviceManager], (deviceManager) => {
  return {
    video: deviceManager.deviceAccess ? deviceManager.deviceAccess.video : undefined,
    audio: deviceManager.deviceAccess ? deviceManager.deviceAccess.audio : undefined
  };
});
