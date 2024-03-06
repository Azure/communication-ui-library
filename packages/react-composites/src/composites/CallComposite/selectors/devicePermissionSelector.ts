// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as reselect from 'reselect';
import { getDeviceManager } from './baseSelectors';

/**
 * @private
 */
export const devicePermissionSelector = reselect.createSelector([getDeviceManager], (deviceManager) => {
  return {
    video: true, //deviceManager.deviceAccess ? deviceManager.deviceAccess.video : undefined,
    audio: true //deviceManager.deviceAccess ? deviceManager.deviceAccess.audio : undefined
  };
});
