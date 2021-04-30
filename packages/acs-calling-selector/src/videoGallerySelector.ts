// © Microsoft Corporation. All rights reserved.
import { Call, LocalVideoStream, RemoteParticipant, RemoteVideoStream } from '@azure/acs-calling-declarative';
import {
  CommunicationUserKind,
  PhoneNumberKind,
  MicrosoftTeamsUserKind,
  UnknownIdentifierKind
} from '@azure/communication-common';
import * as reselect from 'reselect';
import { getCall } from './baseSelectors';
import {
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant,
  VideoGalleryRemoteVideoStream
} from './types/VideoGallery';

const getUserId = (
  identifier: CommunicationUserKind | PhoneNumberKind | MicrosoftTeamsUserKind | UnknownIdentifierKind | undefined
): string => {
  let userId = '';
  switch (identifier?.kind) {
    case 'communicationUser': {
      userId = identifier.communicationUserId;
      break;
    }
    case 'microsoftTeamsUser': {
      userId = identifier.microsoftTeamsUserId;
      break;
    }
    case 'phoneNumber': {
      userId = identifier.phoneNumber;
      break;
    }
    case 'unknown': {
      userId = identifier.id;
      break;
    }
  }
  return userId;
};

const convertRemoteParticipantsToVideoGalleryRemoteParticipants = (
  remoteParticipants: RemoteParticipant[]
): VideoGalleryRemoteParticipant[] => {
  return remoteParticipants.map((participant: RemoteParticipant) => {
    const videoStreams = Array.from(participant.videoStreams.values()).map(
      (videoStream: RemoteVideoStream): VideoGalleryRemoteVideoStream => {
        return {
          id: videoStream.id.toString(),
          mediaStreamType: videoStream.mediaStreamType,
          scalingMode: videoStream.videoStreamRendererView?.scalingMode,
          isMirrored: videoStream.videoStreamRendererView?.isMirrored,
          target: videoStream.videoStreamRendererView?.target,
          isAvailable: videoStream.isAvailable
        };
      }
    );

    return {
      userId: getUserId(participant.identifier),
      displayName: participant.displayName,
      isMuted: participant.isMuted,
      isSpeaking: participant.isSpeaking,
      videoStreams
    };
  });
};

const convertCallToVideoGalleryLocalParticipants = (call: Call): VideoGalleryLocalParticipant => {
  const videoStreams = call.localVideoStreams.map(
    (videoStream: LocalVideoStream): VideoGalleryRemoteVideoStream => {
      return {
        id: videoStream.source.id,
        mediaStreamType: videoStream.mediaStreamType,
        scalingMode: videoStream.videoStreamRendererView?.scalingMode,
        isMirrored: videoStream.videoStreamRendererView?.isMirrored,
        target: videoStream.videoStreamRendererView?.target,
        isAvailable: !!videoStream.videoStreamRendererView
      };
    }
  );
  const identifier = call.callerInfo.identifier;

  return {
    userId: getUserId(identifier),
    displayName: call.callerInfo.displayName,
    isScreenSharingOn: call.isScreenSharingOn,
    isMuted: call.isMuted,
    videoStreams
  };
};

export const videoGallerySelector = reselect.createSelector([getCall], (call: Call | undefined) => {
  return {
    localVideoStreams: call ? convertCallToVideoGalleryLocalParticipants(call) : undefined,
    remoteParticipants: call
      ? convertRemoteParticipantsToVideoGalleryRemoteParticipants(Array.from(call.remoteParticipants.values()))
      : []
  };
});
