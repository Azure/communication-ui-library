// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as reselect from 'reselect';
import { getLocalVideoStreams, getRemoteParticipants } from './baseSelectors';

/**
 * @private
 */
export const mediaGallerySelector = reselect.createSelector([getLocalVideoStreams], (localVideoStreams) => {
  return {
    isVideoStreamOn: !!localVideoStreams?.find((stream) => stream.mediaStreamType === 'Video')?.view?.target
  };
});

/**
 * Custom selector for this hook to retrieve all the participants that are currently
 * connected to the call.
 */
export const getRemoteParticipantsConnectedSelector = reselect.createSelector(
  [getRemoteParticipants],
  (remoteParticipants) => {
    const participants = Object.values(remoteParticipants ?? {});
    return participants.filter((p) => p.state === 'Connected');
  }
);
