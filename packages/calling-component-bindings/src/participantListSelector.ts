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

/**
 * Selector type for {@link ParticipantList} component.
 *
 * @public
 */
export type ParticipantListSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  participants: CallParticipant[];
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
