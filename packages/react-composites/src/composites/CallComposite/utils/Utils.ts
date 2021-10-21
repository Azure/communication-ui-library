// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MeetingCompositePage } from '../../MeetingComposite/state/MeetingCompositePage';
import { CallAdapterState, CallCompositePage } from '../adapter/CallAdapter';
import { _isPreviewOn } from '@internal/calling-component-bindings';
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
export const reduceCallControlsForMobile = (
  callControlOptions: CallControlOptions | boolean | undefined
): CallControlOptions | false => {
  if (callControlOptions === false) {
    return false;
  }

  // Ensure call controls a valid object.
  const reduceCallControlOptions = callControlOptions === true ? {} : callControlOptions || {};

  // Set to compressed mode when composite is optimized for mobile, unless developer has explicitly opted out.
  if (reduceCallControlOptions.compressedMode !== false) {
    reduceCallControlOptions.compressedMode = true;
  }

  // Do not show screen share button when composite is optimized for mobile unless the developer
  // has explicitly opted in.
  if (reduceCallControlOptions.screenShareButton !== true) {
    reduceCallControlOptions.screenShareButton = false;
  }

  return reduceCallControlOptions;
};

/**
 * @private
 */
export const isInLobbyOrConnecting = (page: CallCompositePage | MeetingCompositePage): boolean => page === 'lobby';
