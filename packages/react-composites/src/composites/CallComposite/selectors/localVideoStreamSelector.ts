// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _isInCall, _isPreviewOn } from '@internal/calling-component-bindings';
import { DeviceManagerState, LocalVideoStreamState } from '@internal/calling-stateful-client';
import * as reselect from 'reselect';
import { getDeviceManager, getLocalVideoStreams } from './baseSelectors';
import { callStatusSelector } from './callStatusSelector';
import { CallState as SDKCallStatus } from '@azure/communication-calling';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function selectLocalVideo(
  callStatus: {
    callStatus: SDKCallStatus;
    isScreenShareOn: boolean;
  },
  deviceManager: DeviceManagerState,
  localVideoStreams?: LocalVideoStreamState[]
) {
  let localVideoStream: LocalVideoStreamState | undefined;
  if (_isInCall(callStatus.callStatus)) {
    localVideoStream = localVideoStreams?.find((i) => i.mediaStreamType === 'Video');
  } else if (_isPreviewOn(deviceManager)) {
    // TODO: we should take in a LocalVideoStream that developer wants to use as their 'Preview' view. We should also
    // handle cases where 'Preview' view is in progress and not necessary completed.
    localVideoStream = deviceManager.unparentedViews[0];
  }

  return {
    isAvailable: !!localVideoStream,
    isMirrored: localVideoStream?.view?.isMirrored,
    renderElement: localVideoStream?.view?.target
  };
}

/**
 * @private
 */
export const localVideoSelector = reselect.createSelector(
  [callStatusSelector, getDeviceManager, getLocalVideoStreams],
  selectLocalVideo
);
