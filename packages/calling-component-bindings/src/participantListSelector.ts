// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { CallClientState, RemoteParticipantState } from '@internal/calling-stateful-client';
import { createSelector } from 'reselect';
import {
  getIdentifier,
  getDisplayName,
  getRemoteParticipants,
  getIsScreenSharingOn,
  getIsMuted,
  CallingBaseSelectorProps
} from './baseSelectors';
import { CallParticipantListParticipant } from '@internal/react-components';
import { getIdentifierKind } from '@azure/communication-common';

const convertRemoteParticipantsToParticipantListParticipants = (
  remoteParticipants: RemoteParticipantState[]
): CallParticipantListParticipant[] => {
  return remoteParticipants
    .map((participant: RemoteParticipantState) => {
      const isScreenSharing = Object.values(participant.videoStreams).some(
        (videoStream) => videoStream.mediaStreamType === 'ScreenSharing' && videoStream.isAvailable
      );

      return {
        userId: toFlatCommunicationIdentifier(participant.identifier),
        displayName: participant.displayName,
        state: participant.state,
        isMuted: participant.isMuted,
        isScreenSharing: isScreenSharing,
        isSpeaking: participant.isSpeaking,
        // ACS users can not remove Teams users.
        // Removing phone numbers or unknown types of users is undefined.
        isRemovable: getIdentifierKind(participant.identifier).kind === 'communicationUser'
      };
    })
    .sort((a, b) => {
      const nameA = a.displayName?.toLowerCase() || '';
      const nameB = b.displayName?.toLowerCase() || '';
      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    });
};

/**
 * Selector type for {@link ParticipantList} component.
 *
 * @public
 */
export type ParticipantListSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  participants: CallParticipantListParticipant[];
  myUserId: string;
};

/**
 * Selects data that drives {@link ParticipantList} component.
 *
 * @public
 */
export const participantListSelector: ParticipantListSelector = createSelector(
  [getIdentifier, getDisplayName, getRemoteParticipants, getIsScreenSharingOn, getIsMuted],
  (
    userId,
    displayName,
    remoteParticipants,
    isScreenSharingOn,
    isMuted
  ): {
    participants: CallParticipantListParticipant[];
    myUserId: string;
  } => {
    const participants = remoteParticipants
      ? convertRemoteParticipantsToParticipantListParticipants(Object.values(remoteParticipants))
      : [];
    participants.push({
      userId: userId,
      displayName: displayName,
      isScreenSharing: isScreenSharingOn,
      isMuted: isMuted,
      state: 'Connected',
      // Local participant can never remove themselves.
      isRemovable: false
    });
    return {
      participants: participants,
      myUserId: userId
    };
  }
);
