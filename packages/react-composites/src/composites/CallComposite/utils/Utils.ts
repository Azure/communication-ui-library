// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DeviceManagerState } from '@internal/calling-stateful-client';
import { CallAdapterState } from '../adapter/CallAdapter';
import { CallControlOptions } from '../components/CallControls';

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
export const isPreviewOn = (deviceManager: DeviceManagerState): boolean => {
  // TODO: we should take in a LocalVideoStream that developer wants to use as their 'Preview' view. We should also
  // handle cases where 'Preview' view is in progress and not necessary completed.
  return deviceManager.unparentedViews.length > 0 && deviceManager.unparentedViews[0].view !== undefined;
};

/**
 * Reduce the set of call controls visible on mobile.
 * For example do not show screenshare button.
 *
 * @private
 */
export const reduceCallControlsSetForMobile = (callControlOptions: CallControlOptions): CallControlOptions => {
  const reduceCallControlOptions = callControlOptions;

  // Do not show screen share button when composite is optimized for mobile unless the developer
  // has explicitly opted in.
  if (
    reduceCallControlOptions &&
    typeof reduceCallControlOptions !== 'boolean' &&
    reduceCallControlOptions.screenShareButton !== true
  ) {
    reduceCallControlOptions.screenShareButton = false;
  }

  return reduceCallControlOptions;
};
