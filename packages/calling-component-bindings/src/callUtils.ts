// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState as CallStatus } from '@azure/communication-calling';
import { DeviceManagerState, StatefulCallClient } from '@internal/calling-stateful-client';

/**
 * Check if the call state represents being connected to a call
 *
 * @internal
 */
export const _isInCall = (callStatus?: CallStatus): boolean =>
  !!callStatus && !['None', 'Disconnected', 'Connecting'].includes(callStatus);

/**
 * Check if the device manager local video is on when not part of a call
 * i.e. do unparented views exist.
 *
 * @internal
 */
export const _isPreviewOn = (deviceManager: DeviceManagerState): boolean => {
  // TODO: we should take in a LocalVideoStream that developer wants to use as their 'Preview' view. We should also
  // handle cases where 'Preview' view is in progress and not necessary completed.
  return deviceManager.unparentedViews.length > 0 && deviceManager.unparentedViews[0].view !== undefined;
};

/**
 * Dispose of all preview (i.e. unparented) views
 *
 * @private
 */
export const disposeAllLocalPreviewViews = async (callClient: StatefulCallClient): Promise<void> => {
  const unparentedViews = callClient.getState().deviceManager.unparentedViews;
  for (const view of unparentedViews) {
    await callClient.disposeView(undefined, undefined, view);
  }
};
