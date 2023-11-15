// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  DominantSpeakersInfo,
  RemoteParticipantState as RemoteParticipantConnectionState
} from '@azure/communication-calling';
/* @conditional-compile-remove(hide-attendee-name) */
import { ParticipantRole } from '@azure/communication-calling';
import { memoizeFnAll, toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { RemoteParticipantState, RemoteVideoStreamState } from '@internal/calling-stateful-client';
import { VideoGalleryRemoteParticipant, VideoGalleryStream } from '@internal/react-components';
import memoizeOne from 'memoize-one';
import { _isRingingPSTNParticipant } from './callUtils';
/* @conditional-compile-remove(hide-attendee-name) */
import { maskDisplayNameWithRole } from './callUtils';
import { checkIsSpeaking } from './SelectorUtils';
import { isPhoneNumberIdentifier } from '@azure/communication-common';
/* @conditional-compile-remove(raise-hand) */
import { RaisedHandState } from '@internal/calling-stateful-client';

/** @internal */
export const _dominantSpeakersWithFlatId = (dominantSpeakers?: DominantSpeakersInfo): undefined | string[] => {
  return dominantSpeakers?.speakersList?.map(toFlatCommunicationIdentifier);
};

/** @internal */
export const _videoGalleryRemoteParticipantsMemo: (
  remoteParticipants: RemoteParticipantState[] | undefined,
  /* @conditional-compile-remove(hide-attendee-name) */
  isHideAttendeeNamesEnabled?: boolean,
  /* @conditional-compile-remove(hide-attendee-name) */
  localUserRole?: ParticipantRole
) => VideoGalleryRemoteParticipant[] = (
  remoteParticipants: RemoteParticipantState[] | undefined,
  isHideAttendeeNamesEnabled?: boolean,
  localUserRole?
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
            isPhoneNumberIdentifier(participant.identifier)
          );
        })
        .map((participant: RemoteParticipantState) => {
          const state = _isRingingPSTNParticipant(participant);
          let displayName = participant.displayName;
          /* @conditional-compile-remove(hide-attendee-name) */
          displayName = maskDisplayNameWithRole(
            displayName,
            localUserRole,
            participant.role,
            isHideAttendeeNamesEnabled
          );
          return memoizedFn(
            toFlatCommunicationIdentifier(participant.identifier),
            participant.isMuted,
            checkIsSpeaking(participant),
            participant.videoStreams,
            state,
            displayName,
            participant.pptLiveStream,
            /* @conditional-compile-remove(raise-hand) */
            participant.raisedHand
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
    displayName?: string,
    pptLiveStream?: HTMLElement,
    /* @conditional-compile-remove(raise-hand) */
    raisedHand?: unknown // temp unknown type to build stable
  ): VideoGalleryRemoteParticipant => {
    return convertRemoteParticipantToVideoGalleryRemoteParticipant(
      userId,
      isMuted,
      isSpeaking,
      videoStreams,
      state,
      displayName,
      pptLiveStream,
      /* @conditional-compile-remove(raise-hand) */
      raisedHand as RaisedHandState
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
  displayName?: string,
  pptLiveStream?: HTMLElement,
  /* @conditional-compile-remove(raise-hand) */
  raisedHand?: unknown // temp unknown type to build stable
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
    pptLiveStream,
    isScreenSharingOn: screenShareStream !== undefined && screenShareStream.isAvailable,
    /* @conditional-compile-remove(one-to-n-calling) */
    /* @conditional-compile-remove(PSTN-calls) */
    state,
    /* @conditional-compile-remove(raise-hand) */
    raisedHand: raisedHand as RaisedHandState
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
    scalingMode: stream.view?.scalingMode,
    /* @conditional-compile-remove(pinned-participants) */
    streamSize: stream.streamSize
  };
};

/** @private */
export const memoizeLocalParticipant = memoizeOne(
  (
    identifier,
    displayName,
    isMuted,
    isScreenSharingOn,
    localVideoStream,
    /* @conditional-compile-remove(rooms) */ role,
    /* @conditional-compile-remove(raise-hand) */ raisedHand
  ) => ({
    userId: identifier,
    displayName: displayName ?? '',
    isMuted: isMuted,
    isScreenSharingOn: isScreenSharingOn,
    videoStream: {
      isAvailable: !!localVideoStream,
      isMirrored: localVideoStream?.view?.isMirrored,
      renderElement: localVideoStream?.view?.target
    },
    /* @conditional-compile-remove(rooms) */
    role,
    /* @conditional-compile-remove(raise-hand) */
    raisedHand: raisedHand
  })
);
