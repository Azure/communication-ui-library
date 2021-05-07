// © Microsoft Corporation. All rights reserved.

// @ts-ignore
import * as reselect from 'reselect';
// @ts-ignore
import * as callingDeclarative from '@azure/acs-calling-declarative';
// @ts-ignore
import { BaseSelectorProps } from './baseSelectors';
import { getCall, getUserId, getDisplayName } from './baseSelectors';
import { WebUIParticipant } from './types/WebUIParticipant';
import {
  CommunicationUserKind,
  PhoneNumberKind,
  MicrosoftTeamsUserKind,
  UnknownIdentifierKind
} from '@azure/communication-common';

const getACSId = (
  identifier: CommunicationUserKind | PhoneNumberKind | MicrosoftTeamsUserKind | UnknownIdentifierKind
): string => {
  switch (identifier.kind) {
    case 'communicationUser': {
      return identifier.communicationUserId;
    }
    case 'phoneNumber': {
      return identifier.phoneNumber;
    }
    case 'microsoftTeamsUser': {
      return identifier.microsoftTeamsUserId;
    }
    default: {
      return identifier.id;
    }
  }
};

const convertRemoteParticipantsToWebUIParticipants = (
  remoteParticipants: callingDeclarative.RemoteParticipant[]
): WebUIParticipant[] => {
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
    userId: string;
    displayName?: string;
    remoteParticipants?: WebUIParticipant[];
    isScreenSharingOn?: boolean;
    isMuted?: boolean;
  } => {
    return {
      userId: userId,
      displayName: displayName,
      remoteParticipants:
        call && call?.remoteParticipants
          ? convertRemoteParticipantsToWebUIParticipants(Array.from(call?.remoteParticipants.values()))
          : [],
      isScreenSharingOn: call?.isScreenSharingOn ?? false,
      isMuted: call?.isMuted ?? false
    };
  }
);
