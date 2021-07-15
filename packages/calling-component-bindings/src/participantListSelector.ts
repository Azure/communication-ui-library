// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { RemoteParticipantState } from '@internal/calling-stateful-client';
import * as reselect from 'reselect';
import {
  getIdentifier,
  getDisplayName,
  getRemoteParticipants,
  getIsScreenSharingOn,
  getIsMuted
} from './baseSelectors';
import { CallParticipant } from '@internal/react-components';

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
  [getIdentifier, getDisplayName, getRemoteParticipants, getIsScreenSharingOn, getIsMuted],
  (
    userId,
    displayName,
    remoteParticipants,
    isScreenSharingOn,
    isMuted
  ): {
    participants: CallParticipant[];
    myUserId: string;
  } => {
    const participants = remoteParticipants
      ? convertRemoteParticipantsToCommunicationParticipants(Object.values(remoteParticipants))
      : [];
    participants.push({
      userId: userId,
      displayName: displayName,
      isScreenSharing: isScreenSharingOn,
      isMuted: isMuted,
      state: 'Connected'
    });
    return {
      participants: participants,
      myUserId: userId
    };
  }
);
