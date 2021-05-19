// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallClientState, DeviceManagerState } from 'calling-stateful-client';

export const getIsPreviewCameraOn = (state: CallClientState): boolean => isPreviewOn(state.deviceManager);

const isPreviewOn = (deviceManager: DeviceManagerState): boolean => {
  return !!deviceManager.unparentedViews && !!deviceManager.unparentedViews[0]?.target;
};
