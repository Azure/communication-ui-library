// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _dominantSpeakersWithFlatId } from '@internal/calling-component-bindings';
/* @conditional-compile-remove(PSTN-calls) */
import { _updateUserDisplayNames } from '@internal/calling-component-bindings';
import { RemoteParticipantState } from '@internal/calling-stateful-client';
import * as reselect from 'reselect';
import { getDominantSpeakerInfo, getRemoteParticipants } from './baseSelectors';

/**
 * Get the most dominant remote participant, if no dominant speaker IDs exist, this uses
 * one of the remote participants with no bias towards which one.
 *
 * @private
 */
export const dominantRemoteParticipantSelector = reselect.createSelector(
  [getRemoteParticipants, getDominantSpeakerInfo],
  (remoteParticipants, dominantSpeakerInfo) => {
    const dominantSpeakers = _dominantSpeakersWithFlatId(dominantSpeakerInfo);
    const dominantRemoteParticipant =
      remoteParticipants && Object.keys(remoteParticipants).length > 0
        ? findDominantRemoteParticipant(remoteParticipants, dominantSpeakers ?? [])
        : undefined;
    return dominantRemoteParticipant;
  }
);

const findDominantRemoteParticipant = (
  remoteParticipants: { [keys: string]: RemoteParticipantState },
  dominantSpeakerIds: string[]
): RemoteParticipantState => {
  let dominantRemoteParticipantId = dominantSpeakerIds[0];

  // Fallback to using the first remote participant if there are no dominant speaker IDs
  // or if the dominant speaker is no longer available in the list of remoteParticipantIds
  const remoteParticipantIds = Object.keys(remoteParticipants);
  if (!dominantRemoteParticipantId || !remoteParticipantIds.includes(dominantRemoteParticipantId)) {
    dominantRemoteParticipantId = remoteParticipantIds[0];
  }

  return remoteParticipants[dominantRemoteParticipantId];
};
