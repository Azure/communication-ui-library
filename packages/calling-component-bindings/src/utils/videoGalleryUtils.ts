// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  DominantSpeakersInfo,
  RemoteParticipantState as RemoteParticipantConnectionState
} from '@azure/communication-calling';
import { memoizeFnAll, toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { RemoteParticipantState, RemoteVideoStreamState } from '@internal/calling-stateful-client';
import { VideoGalleryRemoteParticipant, VideoGalleryStream } from '@internal/react-components';
import memoizeOne from 'memoize-one';
import { _isRingingPSTNParticipant } from './callUtils';
import { checkIsSpeaking } from './SelectorUtils';

/** @internal */
export const _dominantSpeakersWithFlatId = (dominantSpeakers?: DominantSpeakersInfo): undefined | string[] => {
  return dominantSpeakers?.speakersList?.map(toFlatCommunicationIdentifier);
};

/** @internal */
export const _videoGalleryRemoteParticipantsMemo = (
  remoteParticipants: RemoteParticipantState[] | undefined
): VideoGalleryRemoteParticipant[] => {
  if (!remoteParticipants) {
    return [];
  }
  return memoizedAllConvertRemoteParticipant((memoizedFn) => {
    return (
      Object.values(remoteParticipants)
        /**
         * hiding participants who are inLobby, idle, or connecting in ACS clients till we can admit users through ACS clients.
         * phone users will be in the connecting state until they are connected to the call.
         */
        .filter((participant: RemoteParticipantState) => {
          return (
            !['InLobby', 'Idle', 'Connecting', 'Disconnected'].includes(participant.state) ||
            participant.identifier.kind === 'phoneNumber'
          );
        })
        .map((participant: RemoteParticipantState) => {
          const state = _isRingingPSTNParticipant(participant);
          return memoizedFn(
            toFlatCommunicationIdentifier(participant.identifier),
            participant.isMuted,
            checkIsSpeaking(participant),
            participant.videoStreams,
            state,
            participant.displayName
          );
        })
    );
  });
};

const memoizedAllConvertRemoteParticipant = memoizeFnAll(
  (
    userId: string,
    isMuted: boolean,
    isSpeaking: boolean,
    videoStreams: { [key: number]: RemoteVideoStreamState },
    state: RemoteParticipantConnectionState,
    displayName?: string
  ): VideoGalleryRemoteParticipant => {
    return convertRemoteParticipantToVideoGalleryRemoteParticipant(
      userId,
      isMuted,
      isSpeaking,
      videoStreams,
      state,
      displayName
    );
  }
);

/** @private */
export const convertRemoteParticipantToVideoGalleryRemoteParticipant = (
  userId: string,
  isMuted: boolean,
  isSpeaking: boolean,
  videoStreams: { [key: number]: RemoteVideoStreamState },
  state: RemoteParticipantConnectionState,
  displayName?: string
): VideoGalleryRemoteParticipant => {
  const rawVideoStreamsArray = Object.values(videoStreams);
  let videoStream: VideoGalleryStream | undefined = undefined;
  let screenShareStream: VideoGalleryStream | undefined = undefined;

  const sdkRemoteVideoStream =
    Object.values(rawVideoStreamsArray).find((i) => i.mediaStreamType === 'Video' && i.isAvailable) ||
    Object.values(rawVideoStreamsArray).find((i) => i.mediaStreamType === 'Video');

  const sdkScreenShareStream =
    Object.values(rawVideoStreamsArray).find((i) => i.mediaStreamType === 'ScreenSharing' && i.isAvailable) ||
    Object.values(rawVideoStreamsArray).find((i) => i.mediaStreamType === 'ScreenSharing');

  if (sdkRemoteVideoStream) {
    videoStream = convertRemoteVideoStreamToVideoGalleryStream(sdkRemoteVideoStream);
  }
  if (sdkScreenShareStream) {
    screenShareStream = convertRemoteVideoStreamToVideoGalleryStream(sdkScreenShareStream);
  }

  return {
    userId,
    displayName,
    isMuted,
    isSpeaking,
    videoStream,
    screenShareStream,
    isScreenSharingOn: screenShareStream !== undefined && screenShareStream.isAvailable,
    /* @conditional-compile-remove(one-to-n-calling) */
    /* @conditional-compile-remove(PSTN-calls) */
    state
  };
};

const convertRemoteVideoStreamToVideoGalleryStream = (stream: RemoteVideoStreamState): VideoGalleryStream => {
  return {
    id: stream.id,
    isAvailable: stream.isAvailable,
    /* @conditional-compile-remove(video-stream-is-receiving-flag) */
    isReceiving: stream.isReceiving,
    isMirrored: stream.view?.isMirrored,
    renderElement: stream.view?.target,
    /* @conditional-compile-remove(pinned-participants) */
    scalingMode: stream.view?.scalingMode
  };
};

/** @private */
export const memoizeLocalParticipant = memoizeOne(
  (identifier, displayName, isMuted, isScreenSharingOn, localVideoStream) => ({
    userId: identifier,
    displayName: displayName ?? '',
    isMuted: isMuted,
    isScreenSharingOn: isScreenSharingOn,
    videoStream: {
      isAvailable: !!localVideoStream,
      isMirrored: localVideoStream?.view?.isMirrored,
      renderElement: localVideoStream?.view?.target
    }
  })
);
