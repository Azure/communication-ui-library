// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { toFlatCommunicationIdentifier } from 'acs-ui-common';
import { RemoteParticipantState } from 'calling-stateful-client';
import * as reselect from 'reselect';
import { getCall, getIdentifier, getDisplayName } from './baseSelectors';
import { CallParticipant } from 'react-components';

const convertRemoteParticipantsToCommunicationParticipants = (
  remoteParticipants: RemoteParticipantState[]
): CallParticipant[] => {
  return remoteParticipants.map((participant: RemoteParticipantState) => {
    const isScreenSharing = Object.values(participant.videoStreams).some(
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

export const participantListSelector = reselect.createSelector(
  [getIdentifier, getDisplayName, getCall],
  (
    userId,
    displayName,
    call
  ): {
    participants: CallParticipant[];
    myUserId: string;
  } => {
    const remoteParticipants =
      call && call?.remoteParticipants
        ? convertRemoteParticipantsToCommunicationParticipants(Object.values(call?.remoteParticipants))
        : [];
    remoteParticipants.push({
      userId: userId,
      displayName: displayName,
      isScreenSharing: call?.isScreenSharingOn,
      isMuted: call?.isMuted,
      state: 'Connected'
    });
    return {
      participants: remoteParticipants,
      myUserId: userId
    };
  }
);
