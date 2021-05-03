// © Microsoft Corporation. All rights reserved.

// @ts-ignore
import { Call, LocalVideoStream, RemoteParticipant, RemoteVideoStream } from '@azure/acs-calling-declarative';
// @ts-ignore
import * as callingStateful from '@azure/acs-calling-declarative';
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
import { getCall, BaseSelectorProps, getDisplayName, getIdentifier } from './baseSelectors';
// @ts-ignore
import {
  MediaStreamType,
  ScalingMode,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant,
  VideoGalleryVideoStream
} from './types/VideoGallery';
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

const memoizedAllConvertVideoGalleryVideoStream = memoizeFnAll(
  (
    key: string,
    mediaStreamType: MediaStreamType,
    isAvailable: boolean,
    scalingMode?: ScalingMode,
    isMirrored?: boolean,
    target?: HTMLElement
  ): VideoGalleryVideoStream => {
    return {
      id: key,
      mediaStreamType,
      scalingMode,
      isMirrored,
      target,
      isAvailable
    };
  }
);

const memoizedAllConvertRemoteParticipant = memoizeFnAll(
  (
    key: string,
    isMuted: boolean,
    isSpeaking: boolean,
    videoStreams: Map<number, RemoteVideoStream>,
    displayName?: string
  ): VideoGalleryRemoteParticipant => {
    const convertedVideoStreams = memoizedAllConvertVideoGalleryVideoStream((memoizedFn) =>
      Array.from(videoStreams.values()).map((videoStream) => {
        return memoizedFn(
          videoStream.id.toString(),
          videoStream.mediaStreamType,
          videoStream.isAvailable,
          videoStream.videoStreamRendererView?.scalingMode,
          videoStream.videoStreamRendererView?.isMirrored,
          videoStream.videoStreamRendererView?.target
        );
      })
    );

    return {
      userId: key,
      displayName: displayName,
      isMuted: isMuted,
      isSpeaking: isSpeaking,
      // From the current calling sdk, remote participant videoStreams is actually a typle
      // The first item is always video stream
      // The second item is always screenshare stream
      videoStream: convertedVideoStreams[0],
      screenShareStream: convertedVideoStreams[1]
    };
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
  const convertedVideoStreams = memoizedAllConvertVideoGalleryVideoStream((memoizedFn) =>
    call.localVideoStreams.map((videoStream) => {
      return memoizedFn(
        videoStream.source.id,
        videoStream.mediaStreamType,
        !!videoStream.videoStreamRendererView,
        videoStream.videoStreamRendererView?.scalingMode,
        videoStream.videoStreamRendererView?.isMirrored,
        videoStream.videoStreamRendererView?.target
      );
    })
  );

  return {
    userId: identifier ?? '',
    displayName: displayName,
    isScreenSharingOn: call.isScreenSharingOn,
    isMuted: call.isMuted,
    // From the current calling sdk, local participant videoStreams could be an empty array
    // or an array with only one video stream item.
    videoStream: convertedVideoStreams[0]
  };
};

export const videoGallerySelector = createSelector(
  [getCall, getDisplayName, getIdentifier],
  (call: Call | undefined, displayName: string | undefined, identifier: string | undefined) => {
    return {
      localParticipant: call ? convertCallToVideoGalleryLocalParticipants(call, displayName, identifier) : undefined,
      remoteParticipants: call
        ? convertRemoteParticipantsToVideoGalleryRemoteParticipants(Array.from(call.remoteParticipants.values()))
        : []
    };
  }
);
