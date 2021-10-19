// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _isInCall } from '@internal/calling-component-bindings';
import { LocalVideoStreamState } from '@internal/calling-stateful-client';
import * as reselect from 'reselect';
import { isPreviewOn } from '../utils';
import { getDeviceManager, getLocalVideoStreams } from './baseSelectors';
import { callStatusSelector } from './callStatusSelector';

/**
 * @private
 */
export const lobbySelector = reselect.createSelector(
  [callStatusSelector, getDeviceManager, getLocalVideoStreams],
  (callStatus, deviceManager, localVideoStreams) => {
    let localVideoStream: LocalVideoStreamState | undefined;
    if (_isInCall(callStatus.callStatus)) {
      localVideoStreams?.find((i) => i.mediaStreamType === 'Video');
    } else if (isPreviewOn(deviceManager)) {
      // TODO: we should take in a LocalVideoStream that developer wants to use as their 'Preview' view. We should also
      // handle cases where 'Preview' view is in progress and not necessary completed.
      localVideoStream = deviceManager.unparentedViews[0];
    }

    return {
      localParticipantVideoStream: {
        isAvailable: !!localVideoStream,
        isMirrored: localVideoStream?.view?.isMirrored,
        renderElement: localVideoStream?.view?.target
      }
    };
  }
);
