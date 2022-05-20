// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DeviceManagerState } from '@internal/calling-stateful-client';
import { createSelector } from 'reselect';
import { getDeviceManager } from './baseSelectors';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function selectLocalVideoCameraCycleButton(deviceManager: DeviceManagerState) {
  return {
    cameras: deviceManager.cameras,
    selectedCamera: deviceManager.selectedCamera
  };
}

/**
 * Provides data attributes to {@link LocalVideoCameraCycleButton} component.
 * @public
 */
export const localVideoCameraCycleButtonSelector = createSelector(
  [getDeviceManager],
  selectLocalVideoCameraCycleButton
);
