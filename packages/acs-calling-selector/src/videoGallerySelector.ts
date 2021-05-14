// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// @ts-ignore
import { Call, LocalVideoStream, RemoteParticipant, RemoteVideoStream } from 'calling-stateful-client';
// @ts-ignore
import * as callingStateful from 'calling-stateful-client';
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
    isMirrored: stream.videoStreamRendererView?.isMirrored,
    renderElement: stream.videoStreamRendererView?.target
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
    const rawVideoStreamsArray = Array.from(videoStreams.values());
    let videoStream: VideoGalleryStream | undefined = undefined;
    if (rawVideoStreamsArray[0].mediaStreamType === 'Video') {
      videoStream = convertRemoteVideoStreamToVideoGalleryStream(rawVideoStreamsArray[0]);
    }

    let screenShareStream: VideoGalleryStream | undefined = undefined;
    if (rawVideoStreamsArray[1].mediaStreamType === 'ScreenSharing') {
      screenShareStream = convertRemoteVideoStreamToVideoGalleryStream(rawVideoStreamsArray[1]);
    }

    return {
      userId,
      displayName,
      isMuted,
      isSpeaking,
      // From the current calling sdk, remote participant videoStreams is actually a tuple
      // The first item is always video stream. The second item is always screenshare stream
      videoStream,
      screenShareStream,
      isScreenSharingOn: !!screenShareStream
    };
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
    const localVideoStream = call?.localVideoStreams.find((i) => i.mediaStreamType === 'Video');
    return {
      localParticipant: {
        userId: identifier ?? '',
        displayName: displayName ?? '',
        isMuted: call?.isMuted,
        isScreenSharingOn: call?.isScreenSharingOn,
        videoStream: {
          isAvailable: !!localVideoStream,
          isMirrored: localVideoStream?.videoStreamRendererView?.isMirrored,
          renderElement: localVideoStream?.videoStreamRendererView?.target
        }
      },
      remoteParticipants: videoGalleryRemoteParticipantsFromCall(call)
    };
  }
);
