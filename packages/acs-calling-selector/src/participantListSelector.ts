// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FlatCommunicationIdentifier, toFlatCommunicationIdentifier } from 'acs-ui-common';
// @ts-ignore
import { RemoteParticipant, CallClientState, Call } from 'calling-stateful-client';
// @ts-ignore
import * as reselect from 'reselect';
// @ts-ignore
import { CallingBaseSelectorProps } from './baseSelectors';
import { getCall, getIdentifier, getDisplayName } from './baseSelectors';
import { CallParticipant } from 'react-components';

const convertRemoteParticipantsToCommunicationParticipants = (
  remoteParticipants: RemoteParticipant[]
): CallParticipant[] => {
  return remoteParticipants.map((participant: RemoteParticipant) => {
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

export const participantListSelector = reselect.createSelector(
  [getIdentifier, getDisplayName, getCall],
  (
    userId,
    displayName,
    call
  ): {
    participants: CallParticipant[];
    myUserId: FlatCommunicationIdentifier;
  } => {
    const remoteParticipants =
      call && call?.remoteParticipants
        ? convertRemoteParticipantsToCommunicationParticipants(Array.from(call?.remoteParticipants.values()))
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
