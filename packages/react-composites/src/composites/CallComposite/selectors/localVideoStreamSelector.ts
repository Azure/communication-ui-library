// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _isInCall, _isPreviewOn } from '@internal/calling-component-bindings';
import { LocalVideoStreamState } from '@internal/calling-stateful-client';
import * as reselect from 'reselect';
import { getDeviceManager, getLocalVideoStreams } from './baseSelectors';
import { callStatusSelector } from './callStatusSelector';

/**
 * @private
 */
export const localVideoSelector = reselect.createSelector(
  [callStatusSelector, getDeviceManager, getLocalVideoStreams],
  (callStatus, deviceManager, localVideoStreams) => {
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
      renderElement: localVideoStream?.view?.target,

      activeVideoEffects: localVideoStream?.videoEffects
    };
  }
);
