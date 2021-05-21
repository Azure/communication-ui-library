// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import { CallState } from 'calling-stateful-client';
import { getCall, getDisplayName, getIdentifier } from './baseSelectors';

export const lobbySelector = reselect.createSelector(
  [getCall, getDisplayName, getIdentifier],
  (call: CallState | undefined, displayName: string | undefined, identifier: string | undefined) => {
    const localVideoStream = call?.localVideoStreams.find((i) => i.mediaStreamType === 'Video');
    return {
      localParticipant: {
        userId: identifier ?? '',
        displayName: displayName ?? '',
        isMuted: call?.isMuted,
        isScreenSharingOn: call?.isScreenSharingOn,
        videoStream: {
          isAvailable: !!localVideoStream,
          isMirrored: localVideoStream?.view?.isMirrored,
          renderElement: localVideoStream?.view?.target
        }
      }
    };
  }
);
