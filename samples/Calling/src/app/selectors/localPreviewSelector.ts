// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import { getDeviceManager } from './baseSelectors';

export const localPreviewSelector = reselect.createSelector([getDeviceManager], (deviceManager) => {
  return {
    videoStreamElement: deviceManager.unparentedViews[0] ? deviceManager.unparentedViews[0].target : null
  };
});
