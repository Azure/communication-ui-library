// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// @ts-ignore
import { Call, CallClientState, LocalVideoStream, DeviceManager } from 'calling-stateful-client';
// @ts-ignore
import * as reselect from 'reselect';
// @ts-ignore
import { getCall, CallingBaseSelectorProps, getDisplayName, getIdentifier, getDeviceManager } from './baseSelectors';

export const lobbySelector = reselect.createSelector(
  [getCall, getDisplayName, getIdentifier, getDeviceManager],
  (call: Call | undefined, displayName: string | undefined, identifier: string | undefined, deviceManager) => {
    const previewOn = !!deviceManager.unparentedViews && !!deviceManager.unparentedViews[0]?.target;
    const localVideoStream = call?.localVideoStreams.find((i) => i.mediaStreamType === 'Video');
    return {
      localParticipant: {
        userId: identifier ?? '',
        displayName: displayName ?? '',
        isMuted: call?.isMuted,
        isScreenSharingOn: call?.isScreenSharingOn,
        videoStream: {
          isAvailable: !!localVideoStream,
          isMirrored: localVideoStream?.videoStreamRendererView?.isMirrored,
          renderElement: localVideoStream?.videoStreamRendererView?.target
        }
      },
      isCameraChecked: call ? !!localVideoStream : previewOn
    };
  }
);
