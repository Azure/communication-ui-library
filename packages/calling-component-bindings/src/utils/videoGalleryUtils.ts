// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DominantSpeakersInfo } from '@azure/communication-calling';
import { SpotlightedParticipant } from '@azure/communication-calling';
import { ParticipantRole } from '@azure/communication-calling';
import { memoizeFnAll, toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { RemoteParticipantState, RemoteVideoStreamState } from '@internal/calling-stateful-client';
import { VideoGalleryRemoteParticipant, VideoGalleryStream, MediaAccess } from '@internal/react-components';
import memoizeOne from 'memoize-one';
import { _convertParticipantState, ParticipantConnectionState } from './callUtils';
import { maskDisplayNameWithRole } from './callUtils';
import { checkIsSpeaking } from './SelectorUtils';
import { isPhoneNumberIdentifier } from '@azure/communication-common';
import { RaisedHandState } from '@internal/calling-stateful-client';
import { Reaction } from '@internal/react-components';
import { memoizedConvertToVideoTileReaction } from './participantListSelectorUtils';
import { Spotlight } from '@internal/react-components';

/** @internal */
export const _dominantSpeakersWithFlatId = (dominantSpeakers?: DominantSpeakersInfo): undefined | string[] => {
  return dominantSpeakers?.speakersList?.map(toFlatCommunicationIdentifier);
};

/** @internal */
export type _VideoGalleryRemoteParticipantsMemoFn = (
  remoteParticipants: RemoteParticipantState[] | undefined,
  isHideAttendeeNamesEnabled?: boolean,
  localUserRole?: ParticipantRole
) => VideoGalleryRemoteParticipant[];

/** @internal */
export const _videoGalleryRemoteParticipantsMemo: _VideoGalleryRemoteParticipantsMemoFn = (
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
          const state = _convertParticipantState(participant);
          const displayName = maskDisplayNameWithRole(
            participant.displayName,
            localUserRole,
            participant.role,
            isHideAttendeeNamesEnabled
          );
          const remoteParticipantReaction = memoizedConvertToVideoTileReaction(participant.reactionState);
          const spotlight = participant.spotlight;
          return memoizedFn(
            toFlatCommunicationIdentifier(participant.identifier),
            participant.isMuted,
            checkIsSpeaking(participant),
            participant.videoStreams,
            state,
            displayName,
            participant.raisedHand,
            participant.contentSharingStream,
            remoteParticipantReaction,
            spotlight,
            participant.mediaAccess,
            participant.role,
            /* @conditional-compile-remove(remote-ufd) */
            Math.max(
              (participant.diagnostics?.networkReceiveQuality?.value ?? 0) as number,
              (participant.diagnostics?.networkSendQuality?.value ?? 0) as number
            )
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
    state: ParticipantConnectionState,
    displayName?: string,
    raisedHand?: RaisedHandState,
    contentSharingStream?: HTMLElement,
    reaction?: Reaction,
    spotlight?: Spotlight,
    mediaAccess?: MediaAccess,
    role?: ParticipantRole,
    signalStrength?: undefined | /* @conditional-compile-remove(remote-ufd) */ number
  ): VideoGalleryRemoteParticipant => {
    return convertRemoteParticipantToVideoGalleryRemoteParticipant(
      userId,
      isMuted,
      isSpeaking,
      videoStreams,
      state,
      displayName,
      raisedHand,
      contentSharingStream,
      reaction,
      spotlight,
      signalStrength,
      mediaAccess,
      role
    );
  }
);

/** @private */
export const convertRemoteParticipantToVideoGalleryRemoteParticipant = (
  userId: string,
  isMuted: boolean,
  isSpeaking: boolean,
  videoStreams: { [key: number]: RemoteVideoStreamState },
  state: ParticipantConnectionState,
  displayName?: string,
  raisedHand?: RaisedHandState,
  contentSharingStream?: HTMLElement,
  reaction?: Reaction,
  spotlight?: Spotlight,
  signalStrength?: undefined | /* @conditional-compile-remove(remote-ufd) */ number,
  mediaAccess?: MediaAccess,
  role?: ParticipantRole
): VideoGalleryRemoteParticipant => {
  const rawVideoStreamsArray = Object.values(videoStreams);
  let videoStream: VideoGalleryStream | undefined = undefined;
  let screenShareStream: VideoGalleryStream | undefined = undefined;

  /**
   * There is a bug from the calling sdk where if a user leaves and rejoins immediately
   * it adds 2 more potential streams this remote participant can use. The old 2 streams
   * still show as available and that is how we got a frozen stream in this case. The stopgap
   * until streams accurately reflect their availability is to always prioritize the latest streams of a certain type
   * e.g findLast instead of find
   */
  const sdkRemoteVideoStream =
    Object.values(rawVideoStreamsArray).findLast((i) => i.mediaStreamType === 'Video' && i.isAvailable) ||
    Object.values(rawVideoStreamsArray).findLast((i) => i.mediaStreamType === 'Video');

  const sdkScreenShareStream =
    Object.values(rawVideoStreamsArray).findLast((i) => i.mediaStreamType === 'ScreenSharing' && i.isAvailable) ||
    Object.values(rawVideoStreamsArray).findLast((i) => i.mediaStreamType === 'ScreenSharing');

  if (sdkRemoteVideoStream) {
    videoStream = convertRemoteVideoStreamToVideoGalleryStream(sdkRemoteVideoStream);
  }
  if (sdkScreenShareStream) {
    screenShareStream = convertRemoteVideoStreamToVideoGalleryStream(sdkScreenShareStream);
  }

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
    state,
    raisedHand,
    reaction,
    spotlight,
    mediaAccess,
    canAudioBeForbidden: role === 'Attendee',
    canVideoBeForbidden: role === 'Attendee',
    /* @conditional-compile-remove(remote-ufd) */
    signalStrength
  };
};

const convertRemoteVideoStreamToVideoGalleryStream = (stream: RemoteVideoStreamState): VideoGalleryStream => {
  return {
    id: stream.id,
    isAvailable: stream.isAvailable,
    isReceiving: stream.isReceiving,
    isMirrored: stream.view?.isMirrored,
    renderElement: stream.view?.target,
    scalingMode: stream.view?.scalingMode,
    streamSize: stream.streamSize
  };
};

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
    localScreenSharingStream,
    role,
    raisedHand,
    reaction,
    localSpotlight,
    capabilities
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
    screenShareStream: {
      isAvailable: !!localScreenSharingStream,
      renderElement: localScreenSharingStream?.view?.target
    },
    role,
    raisedHand: raisedHand,
    reaction,
    spotlight: localSpotlight,
    capabilities,
    mediaAccess: {
      isAudioPermitted: capabilities?.unmuteMic ? capabilities.unmuteMic.isPresent : true,
      isVideoPermitted: capabilities?.turnVideoOn ? capabilities.turnVideoOn.isPresent : true
    }
  })
);

/** @private */
export const memoizeSpotlightedParticipantIds = memoizeOne((spotlightedParticipants) =>
  spotlightedParticipants?.map((p: SpotlightedParticipant) => toFlatCommunicationIdentifier(p.identifier))
);

/** @private */
export const memoizeTogetherModeStreams = memoizeOne((togetherModeStreams) => ({
  mainVideoStream: {
    id: togetherModeStreams?.mainVideoStream?.id,
    isReceiving: togetherModeStreams?.mainVideoStream?.isReceiving,
    isAvailable: togetherModeStreams?.mainVideoStream?.isAvailable,
    renderElement: togetherModeStreams?.mainVideoStream?.view?.target,
    streamSize: togetherModeStreams?.mainVideoStream?.streamSize
  }
}));
