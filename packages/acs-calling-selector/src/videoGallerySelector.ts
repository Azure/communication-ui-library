// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// @ts-ignore
import {
  Call,
  // @ts-ignore
  CallClientState,
  RemoteParticipant,
  RemoteVideoStream,
  // @ts-ignore
  VideoStreamRendererViewStatus
} from 'calling-stateful-client';
// @ts-ignore
import { createSelector } from 'reselect';
// @ts-ignore
import * as reselect from 'reselect';
// @ts-ignore
import { getCall, CallingBaseSelectorProps, getDisplayName, getIdentifier, getCallId } from './baseSelectors';
// @ts-ignore
import { memoizeFnAll } from './utils/memoizeFnAll';
import { getACSId } from './utils/getACSId';
import { VideoGalleryRemoteParticipant, VideoGalleryStream } from 'react-components';

const convertRemoteVideoStreamToVideoGalleryStream = (stream: RemoteVideoStream): VideoGalleryStream => {
  return {
    id: stream.id,
    isAvailable: stream.isAvailable,
    isMirrored: stream.view?.isMirrored,
    renderStatus: stream.viewStatus,
    renderElement: stream.view?.target
  };
};

const convertRemoteParticipantToVideoGalleryRemoteParticipant = (
  userId: string,
  isMuted: boolean,
  isSpeaking: boolean,
  videoStreams: Map<number, RemoteVideoStream>,
  displayName?: string
): VideoGalleryRemoteParticipant => {
  const rawVideoStreamsArray = Array.from(videoStreams.values());
  let videoStream: VideoGalleryStream | undefined = undefined;
  let screenShareStream: VideoGalleryStream | undefined = undefined;

  if (rawVideoStreamsArray[0]) {
    if (rawVideoStreamsArray[0].mediaStreamType === 'Video') {
      videoStream = convertRemoteVideoStreamToVideoGalleryStream(rawVideoStreamsArray[0]);
    } else {
      screenShareStream = convertRemoteVideoStreamToVideoGalleryStream(rawVideoStreamsArray[0]);
    }
  }

  if (rawVideoStreamsArray[1]) {
    if (rawVideoStreamsArray[1].mediaStreamType === 'ScreenSharing') {
      screenShareStream = convertRemoteVideoStreamToVideoGalleryStream(rawVideoStreamsArray[1]);
    } else {
      videoStream = convertRemoteVideoStreamToVideoGalleryStream(rawVideoStreamsArray[1]);
    }
  }

  return {
    userId,
    displayName,
    isMuted,
    isSpeaking,
    videoStream,
    screenShareStream,
    isScreenSharingOn: screenShareStream !== undefined && screenShareStream.isAvailable
  };
};

const memoizedAllConvertRemoteParticipant = memoizeFnAll(
  (
    userId: string,
    isMuted: boolean,
    isSpeaking: boolean,
    videoStreams: Map<number, RemoteVideoStream>,
    displayName?: string
  ): VideoGalleryRemoteParticipant => {
    return convertRemoteParticipantToVideoGalleryRemoteParticipant(
      userId,
      isMuted,
      isSpeaking,
      videoStreams,
      displayName
    );
  }
);

const videoGalleryRemoteParticipantsFromCall = (call: Call | undefined): VideoGalleryRemoteParticipant[] => {
  if (!call || !call.remoteParticipants) return [];
  return memoizedAllConvertRemoteParticipant((memoizedFn) => {
    return Array.from(call.remoteParticipants.values()).map((participant: RemoteParticipant) => {
      return memoizedFn(
        getACSId(participant.identifier),
        participant.isMuted,
        participant.isSpeaking,
        participant.videoStreams,
        participant.displayName
      );
    });
  });
};

export const videoGallerySelector = createSelector(
  [getCall, getDisplayName, getIdentifier],
  (call: Call | undefined, displayName: string | undefined, identifier: string | undefined) => {
    const screenShareRemoteParticipant = call?.screenShareRemoteParticipant
      ? call.remoteParticipants.get(call.screenShareRemoteParticipant)
      : undefined;
    const localVideoStream = call?.localVideoStreams.find((i) => i.mediaStreamType === 'Video');
    return {
      screenShareParticipant: screenShareRemoteParticipant
        ? convertRemoteParticipantToVideoGalleryRemoteParticipant(
            getACSId(screenShareRemoteParticipant.identifier),
            screenShareRemoteParticipant.isMuted,
            screenShareRemoteParticipant.isSpeaking,
            screenShareRemoteParticipant.videoStreams,
            screenShareRemoteParticipant.displayName
          )
        : undefined,
      localParticipant: {
        userId: identifier ?? '',
        displayName: displayName ?? '',
        isMuted: call?.isMuted,
        isScreenSharingOn: call?.isScreenSharingOn,
        videoStream: {
          isAvailable: !!localVideoStream,
          isMirrored: localVideoStream?.view?.isMirrored,
          renderStatus: localVideoStream ? localVideoStream.viewStatus : 'NotRendered',
          renderElement: localVideoStream?.view?.target
        }
      },
      remoteParticipants: videoGalleryRemoteParticipantsFromCall(call)
    };
  }
);
