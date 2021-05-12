// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// @ts-ignore
import { Call, LocalVideoStream, RemoteParticipant, RemoteVideoStream } from '@azure/acs-calling-declarative';
// @ts-ignore
import * as callingStateful from '@azure/acs-calling-declarative';
// @ts-ignore
import { createSelector } from 'reselect';
// @ts-ignore
import * as reselect from 'reselect';
// @ts-ignore
import { getCall, BaseSelectorProps, getDisplayName, getIdentifier, getCallId } from './baseSelectors';
// @ts-ignore
import { VideoGalleryLocalParticipant, VideoGalleryRemoteParticipant } from 'react-components';
import { memoizeFnAll } from './utils/memoizeFnAll';
import { getUserId } from './utils/participant';

const memoizedAllConvertRemoteParticipant = memoizeFnAll(
  (
    userId: string,
    isMuted: boolean,
    isSpeaking: boolean,
    videoStreams: Map<number, RemoteVideoStream>,
    displayName?: string
  ): VideoGalleryRemoteParticipant => {
    const rawVideoStreamsArray = Array.from(videoStreams.values());
    const remoteVideoStream = rawVideoStreamsArray[0];
    const screenShareStream = rawVideoStreamsArray[1];
    return {
      userId,
      displayName,
      isMuted,
      isSpeaking,
      // From the current calling sdk, remote participant videoStreams is actually a tuple
      // The first item is always video stream. The second item is always screenshare stream
      videoStream: {
        id: remoteVideoStream.id,
        isAvailable: remoteVideoStream.isAvailable,
        isMirrored: remoteVideoStream.videoStreamRendererView?.isMirrored,
        videoProvider: remoteVideoStream.videoStreamRendererView?.target
      },
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
        getUserId(participant.identifier),
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
    return {
      localParticipant: {
        userId: identifier ?? '',
        displayName: displayName ?? '',
        isMuted: call?.isMuted,
        isScreenSharingOn: call?.isScreenSharingOn,
        videoStream: {
          isAvailable: !!call?.localVideoStreams[0],
          isMirrored: call?.localVideoStreams[0]?.videoStreamRendererView?.isMirrored,
          videoProvider: call?.localVideoStreams[0]?.videoStreamRendererView?.target
        }
      },
      remoteParticipants: videoGalleryRemoteParticipantsFromCall(call)
    };
  }
);
