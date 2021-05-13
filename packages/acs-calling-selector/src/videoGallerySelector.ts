// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// @ts-ignore
import { Call, LocalVideoStream, RemoteParticipant, RemoteVideoStream } from 'calling-stateful-client';
// @ts-ignore
import * as callingStateful from 'calling-stateful-client';
// @ts-ignore
import {
  CommunicationUserKind,
  PhoneNumberKind,
  MicrosoftTeamsUserKind,
  UnknownIdentifierKind
} from '@azure/communication-common';
// @ts-ignore
import { createSelector } from 'reselect';
// @ts-ignore
import * as reselect from 'reselect';
// @ts-ignore
import { getCall, CallingBaseSelectorProps, getDisplayName, getIdentifier, getCallId } from './baseSelectors';
// @ts-ignore
import { VideoGalleryLocalParticipant, VideoGalleryRemoteParticipant } from './types/VideoGallery';
import { memoizeFnAll } from './utils/memoizeFnAll';

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

const convertRemoteParticipantToVideoGalleryRemoteParticipant = (
  key: string,
  isMuted: boolean,
  isSpeaking: boolean,
  videoStreams: Map<number, RemoteVideoStream>,
  displayName?: string
): VideoGalleryRemoteParticipant => {
  const rawVideoStreamsArray = Array.from(videoStreams.values());

  // From the current calling sdk, remote participant videoStreams is actually a tuple. If the first item is Video,
  // then the second item should be screenshare. If the first item is screenshare then the second item should be video.
  let videoStream = rawVideoStreamsArray[0];
  let screenShareStream = rawVideoStreamsArray[1];
  if (videoStream && videoStream.mediaStreamType === 'ScreenSharing') {
    videoStream = rawVideoStreamsArray[1];
    screenShareStream = rawVideoStreamsArray[0];
  }

  return {
    userId: key,
    displayName: displayName,
    isMuted: isMuted,
    isSpeaking: isSpeaking,
    videoStream: videoStream,
    screenShareStream: screenShareStream
  };
};

const memoizedAllConvertRemoteParticipant = memoizeFnAll(
  (
    key: string,
    isMuted: boolean,
    isSpeaking: boolean,
    videoStreams: Map<number, RemoteVideoStream>,
    displayName?: string
  ): VideoGalleryRemoteParticipant => {
    return convertRemoteParticipantToVideoGalleryRemoteParticipant(key, isMuted, isSpeaking, videoStreams, displayName);
  }
);

const convertRemoteParticipantsToVideoGalleryRemoteParticipants = (
  remoteParticipants: RemoteParticipant[]
): VideoGalleryRemoteParticipant[] => {
  return memoizedAllConvertRemoteParticipant((memoizedFn) => {
    return remoteParticipants.map((participant: RemoteParticipant) => {
      return memoizedFn(
        getUserId(participant.identifier),
        participant.isMuted,
        participant.isSpeaking,
        participant.videoStreams,
        participant.displayName
      );
    });
  });
};

const convertCallToVideoGalleryLocalParticipants = (
  call: Call,
  displayName: string | undefined,
  identifier: string | undefined
): VideoGalleryLocalParticipant => {
  return {
    userId: identifier ?? '',
    displayName: displayName,
    isScreenSharingOn: call.isScreenSharingOn,
    isMuted: call.isMuted,
    // From the current calling sdk, local participant videoStreams could be an empty array
    // or an array with only one video stream item.
    videoStream: call.localVideoStreams[0]
  };
};

export const videoGallerySelector = createSelector(
  [getCall, getDisplayName, getIdentifier],
  (call: Call | undefined, displayName: string | undefined, identifier: string | undefined) => {
    const screenShareRemoteParticipant = call?.screenShareRemoteParticipant
      ? call.remoteParticipants.get(call.screenShareRemoteParticipant)
      : undefined;
    return {
      screenShareParticipant: screenShareRemoteParticipant
        ? convertRemoteParticipantToVideoGalleryRemoteParticipant(
            getUserId(screenShareRemoteParticipant.identifier),
            screenShareRemoteParticipant.isMuted,
            screenShareRemoteParticipant.isSpeaking,
            screenShareRemoteParticipant.videoStreams,
            screenShareRemoteParticipant.displayName
          )
        : undefined,
      localParticipant: call ? convertCallToVideoGalleryLocalParticipants(call, displayName, identifier) : undefined,
      remoteParticipants: call
        ? convertRemoteParticipantsToVideoGalleryRemoteParticipants(Array.from(call.remoteParticipants.values()))
        : []
    };
  }
);
