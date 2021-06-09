// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { toFlatCommunicationIdentifier } from 'acs-ui-common';
// @ts-ignore
import { RemoteParticipantState } from 'calling-stateful-client';
// @ts-ignore
import { createSelector } from 'reselect';
// @ts-ignore
import { getCall, getIdentifier, getDisplayName } from './baseSelectors';
import { CallParticipant } from 'react-components';

const convertRemoteParticipantsToCommunicationParticipants = (
  remoteParticipants: RemoteParticipantState[]
): CallParticipant[] => {
  return remoteParticipants.map((participant: RemoteParticipantState) => {
    const isScreenSharing = Array.from(participant.videoStreams.values()).some(
      (videoStream) => videoStream.mediaStreamType === 'ScreenSharing' && videoStream.isAvailable
    );

    return {
      userId: toFlatCommunicationIdentifier(participant.identifier),
      displayName: participant.displayName,
      state: participant.state,
      isMuted: participant.isMuted,
      isScreenSharing: isScreenSharing,
      isSpeaking: participant.isSpeaking
    };
  });
};

export const participantsButtonSelector = createSelector(
  [getIdentifier, getDisplayName, getCall],
  (
    userId,
    displayName,
    call
  ): {
    participantListProps: {
      participants: CallParticipant[];
      myUserId: string;
    };
    callInvitationURL?: string;
  } => {
    const participants =
      call && call?.remoteParticipants
        ? convertRemoteParticipantsToCommunicationParticipants(Array.from(call?.remoteParticipants.values()))
        : [];
    participants.push({
      userId: userId,
      displayName: displayName,
      isScreenSharing: call?.isScreenSharingOn,
      isMuted: call?.isMuted,
      state: 'Connected'
    });
    return {
      participantListProps: {
        participants: participants,
        myUserId: userId
      },
      callInvitationURL: undefined
    };
  }
);
