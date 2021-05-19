// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallClientState, DeviceManager } from 'calling-stateful-client';

export const getIsPreviewCameraOn = (state: CallClientState): boolean => isPreviewOn(state.deviceManager);

// TODO: we should take in a LocalVideoStream that developer wants to use as their 'Preview' view. We should also handle
// cases where 'Preview' view is in progress and not necessary completed.
const isPreviewOn = (deviceManager: DeviceManager): boolean => {
  return deviceManager.unparentedViews.values().next().value?.view !== undefined;
};
