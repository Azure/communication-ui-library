// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import { getDeviceManager } from './baseSelectors';

/**
 * @private
 */
export const localPreviewSelector = reselect.createSelector([getDeviceManager], (deviceManager) => {
  // TODO: we should take in a LocalVideoStream that developer wants to use as their 'Preview' view. We should also
  // handle cases where 'Preview' view is in progress and not necessary completed.
  const view = deviceManager.unparentedViews.length > 0 && deviceManager.unparentedViews[0].view;
  return {
    videoStreamElement: view ? view.target : null
  };
});
