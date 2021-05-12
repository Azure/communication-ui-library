// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// @ts-ignore
import * as reselect from 'reselect';
// @ts-ignore
import * as callingDeclarative from '@azure/acs-calling-declarative';
// @ts-ignore
import { CallingBaseSelectorProps } from './baseSelectors';
import { getCall, getUserId, getDisplayName } from './baseSelectors';
import { CommunicationParticipant } from 'react-components';
import { getACSId } from './utils/getACSId';

const convertRemoteParticipantsToCommunicationParticipants = (
  remoteParticipants: callingDeclarative.RemoteParticipant[]
): CommunicationParticipant[] => {
  return remoteParticipants.map((participant: callingDeclarative.RemoteParticipant) => {
    const isScreenSharing = Array.from(participant.videoStreams.values()).some(
      (videoStream) => videoStream.mediaStreamType === 'ScreenSharing' && videoStream.isAvailable
    );

    return {
      userId: getACSId(participant.identifier),
      displayName: participant.displayName,
      state: participant.state,
      isMuted: participant.isMuted,
      isScreenSharing: isScreenSharing,
      isSpeaking: participant.isSpeaking
    };
  });
};

export const participantListSelector = reselect.createSelector(
  [getUserId, getDisplayName, getCall],
  (
    userId,
    displayName,
    call
  ): {
    participants: CommunicationParticipant[];
    myUserId: string;
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
