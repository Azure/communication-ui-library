// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createSelector } from 'reselect';
import { getDeviceManager } from './baseSelectors';

/**
 * Provides data attributes to {@link LocalVideoCameraCycleButton} component.
 * @public
 */
export const localVideoCameraCycleButtonSelector = createSelector([getDeviceManager], (deviceManager) => {
  return {
    cameras: deviceManager.cameras,
    selectedCamera: deviceManager.selectedCamera
  };
});
