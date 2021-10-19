// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _isPreviewOn } from '@internal/calling-component-bindings';
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
      const previewOn = _isPreviewOn(state.devices);
      return previewOn;
    }
  }
  return false;
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
