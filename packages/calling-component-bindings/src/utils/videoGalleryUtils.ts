// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  DominantSpeakersInfo,
  RemoteParticipantState as RemoteParticipantConnectionState
} from '@azure/communication-calling';
/* @conditional-compile-remove(spotlight) */
import { SpotlightedParticipant } from '@azure/communication-calling';
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
import { RaisedHandState } from '@internal/calling-stateful-client';
/* @conditional-compile-remove(reaction) */
import { Reaction } from '@internal/react-components';
/* @conditional-compile-remove(reaction) */
import { memoizedConvertToVideoTileReaction } from './participantListSelectorUtils';
/* @conditional-compile-remove(spotlight) */
import { Spotlight } from '@internal/react-components';

/** @internal */
export const _dominantSpeakersWithFlatId = (dominantSpeakers?: DominantSpeakersInfo): undefined | string[] => {
  return dominantSpeakers?.speakersList?.map(toFlatCommunicationIdentifier);
};

/** @internal */
export type _VideoGalleryRemoteParticipantsMemoFn = (
  remoteParticipants: RemoteParticipantState[] | undefined,
  /* @conditional-compile-remove(hide-attendee-name) */
  isHideAttendeeNamesEnabled?: boolean,
  /* @conditional-compile-remove(hide-attendee-name) */
  localUserRole?: ParticipantRole
) => VideoGalleryRemoteParticipant[];

/** @internal */
export const _videoGalleryRemoteParticipantsMemo: _VideoGalleryRemoteParticipantsMemoFn = (
  remoteParticipants: RemoteParticipantState[] | undefined,
  isHideAttendeeNamesEnabled?: boolean,
  /* @conditional-compile-remove(hide-attendee-name) */ localUserRole?
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
          /* @conditional-compile-remove(reaction) */
          const remoteParticipantReaction = memoizedConvertToVideoTileReaction(participant.reactionState);
          return memoizedFn(
            toFlatCommunicationIdentifier(participant.identifier),
            participant.isMuted,
            checkIsSpeaking(participant),
            participant.videoStreams,
            state,
            displayName,
            participant.raisedHand,
            /* @conditional-compile-remove(ppt-live) */
            participant.contentSharingStream,
            /* @conditional-compile-remove(reaction) */
            remoteParticipantReaction,
            /* @conditional-compile-remove(spotlight) */
            participant.spotlight
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
    raisedHand?: unknown, // temp unknown type to build stable
    /* @conditional-compile-remove(ppt-live) */
    contentSharingStream?: HTMLElement,
    /* @conditional-compile-remove(reaction) */
    reaction?: unknown, // temp unknown type to build stable
    /* @conditional-compile-remove(spotlight) */
    spotlight?: unknown // temp unknown type to build stable
  ): VideoGalleryRemoteParticipant => {
    return convertRemoteParticipantToVideoGalleryRemoteParticipant(
      userId,
      isMuted,
      isSpeaking,
      videoStreams,
      state,
      displayName,
      raisedHand as RaisedHandState,
      /* @conditional-compile-remove(ppt-live) */
      contentSharingStream,
      /* @conditional-compile-remove(reaction) */
      reaction as Reaction,
      /* @conditional-compile-remove(spotlight) */
      spotlight as Spotlight
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
  raisedHand?: unknown, // temp unknown type to build stable
  /* @conditional-compile-remove(ppt-live) */
  contentSharingStream?: HTMLElement,
  /* @conditional-compile-remove(reaction) */
  reaction?: unknown, // temp unknown type to build stable
  /* @conditional-compile-remove(spotlight) */
  spotlight?: unknown // temp unknown type to build stable
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

  /* @conditional-compile-remove(ppt-live) */
  if (contentSharingStream) {
    screenShareStream = convertRemoteContentSharingStreamToVideoGalleryStream(contentSharingStream);
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
    state,
    raisedHand: raisedHand as RaisedHandState,
    /* @conditional-compile-remove(reaction) */
    reaction: reaction as Reaction,
    /* @conditional-compile-remove(spotlight) */
    spotlight: spotlight as Spotlight
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
    scalingMode: stream.view?.scalingMode,
    streamSize: stream.streamSize
  };
};

/* @conditional-compile-remove(ppt-live) */
const convertRemoteContentSharingStreamToVideoGalleryStream = (stream: HTMLElement): VideoGalleryStream => {
  return {
    isAvailable: !!stream,
    isReceiving: true,
    isMirrored: false,
    renderElement: stream
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
    raisedHand,
    /* @conditional-compile-remove(reaction) */ reaction,
    /* @conditional-compile-remove(spotlight) */ localSpotlight,
    /* @conditional-compile-remove(spotlight) */ capabilities
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
    raisedHand: raisedHand,
    /* @conditional-compile-remove(reaction) */
    reaction: reaction,
    /* @conditional-compile-remove(spotlight) */
    spotlight: localSpotlight,
    /* @conditional-compile-remove(spotlight) */
    capabilities
  })
);

/* @conditional-compile-remove(spotlight) */
/** @private */
export const memoizeSpotlightedParticipantIds = memoizeOne((spotlightedParticipants) =>
  spotlightedParticipants?.map((p: SpotlightedParticipant) => toFlatCommunicationIdentifier(p.identifier))
);
