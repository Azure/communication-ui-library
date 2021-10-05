// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState as CallStatus } from '@azure/communication-calling';
import { DeviceManagerState } from '@internal/calling-stateful-client';
import { CallAdapterState } from './adapter/CallAdapter';

/**
 * @private
 */
export const isInCall = (callStatus: CallStatus): boolean => !!(callStatus !== 'None' && callStatus !== 'Disconnected');

/**
 * @private
 */
export const isCameraOn = (state: CallAdapterState): boolean => {
  if (state.call) {
    const stream = state.call.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video');
    return !!stream;
  } else {
    if (state.devices.selectedCamera) {
      const previewOn = isPreviewOn(state.devices);
      return previewOn;
    }
  }
  return false;
};

/**
 * @private
 */
const isPreviewOn = (deviceManager: DeviceManagerState): boolean => {
  // TODO: we should take in a LocalVideoStream that developer wants to use as their 'Preview' view. We should also
  // handle cases where 'Preview' view is in progress and not necessary completed.
  return deviceManager.unparentedViews.length > 0 && deviceManager.unparentedViews[0].view !== undefined;
};
