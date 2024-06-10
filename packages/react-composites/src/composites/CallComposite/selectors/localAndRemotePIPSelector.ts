// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _videoGalleryRemoteParticipantsMemo } from '@internal/calling-component-bindings';
/* @conditional-compile-remove(PSTN-calls) */
import { _updateUserDisplayNames } from '@internal/calling-component-bindings';
import { RemoteParticipantState } from '@internal/calling-stateful-client';
import * as reselect from 'reselect';
import { localVideoSelector } from './localVideoStreamSelector';
import { dominantRemoteParticipantSelector } from './dominantRemoteParticipantSelector';
import { getDisplayName } from './baseSelectors';
import { getLocalParticipantRaisedHand } from './baseSelectors';
import { getFirstSpotlightedRemoteParticipant } from './getFirstSpotlightedRemoteParticipantSelector';

/**
 * Picture in picture in picture needs to display the most-dominant remote speaker, as well as the local participant video.
 * @private
 */
export const localAndRemotePIPSelector = reselect.createSelector(
  [
    getDisplayName,
    dominantRemoteParticipantSelector,
    localVideoSelector,
    getLocalParticipantRaisedHand,
    getFirstSpotlightedRemoteParticipant
  ],
  (
    displayName,
    dominantRemoteParticipantState,
    localVideoStreamInfo,
    raisedHand,
    firstSpotlightedRemoteParticipantState
  ) => {
    let remoteParticipantState = dominantRemoteParticipantState;
    if (firstSpotlightedRemoteParticipantState) {
      remoteParticipantState = firstSpotlightedRemoteParticipantState;
    }
    const remoteParticipant = remoteParticipantState
      ? _videoGalleryRemoteParticipantsMemo(updateUserDisplayNamesTrampoline([remoteParticipantState]))[0]
      : undefined;
    return {
      localParticipant: {
        displayName,
        videoStream: localVideoStreamInfo,
        raisedHand
      },
      remoteParticipant
    };
  }
);

const updateUserDisplayNamesTrampoline = (remoteParticipants: RemoteParticipantState[]): RemoteParticipantState[] => {
  /* @conditional-compile-remove(PSTN-calls) */
  return _updateUserDisplayNames(remoteParticipants);
  return remoteParticipants;
};
