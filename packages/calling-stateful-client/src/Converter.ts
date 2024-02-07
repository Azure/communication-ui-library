// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  RemoteParticipant as SdkRemoteParticipant,
  RemoteVideoStream as SdkRemoteVideoStream,
  LocalVideoStream as SdkLocalVideoStream,
  VideoStreamRendererView
} from '@azure/communication-calling';
/* @conditional-compile-remove(close-captions) */
import { TeamsCaptionsInfo } from '@azure/communication-calling';
/* @conditional-compile-remove(teams-identity-support) */
import { CallKind } from '@azure/communication-calling';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import {
  CallState,
  RemoteParticipantState as DeclarativeRemoteParticipant,
  RemoteVideoStreamState as DeclarativeRemoteVideoStream,
  LocalVideoStreamState as DeclarativeLocalVideoStream,
  IncomingCallState as DeclarativeIncomingCall,
  VideoStreamRendererViewState as DeclarativeVideoStreamRendererView
} from './CallClientState';
/* @conditional-compile-remove(close-captions) */
import { CaptionsInfo } from './CallClientState';

/* @conditional-compile-remove(teams-identity-support) */
import { _isACSCall } from './TypeGuards';
import { CallCommon, IncomingCallCommon } from './BetaToStableTypes';

/* @conditional-compile-remove(video-background-effects) */ /* @conditional-compile-remove(optimal-video-count) */
import { Features } from '@azure/communication-calling';
/* @conditional-compile-remove(video-background-effects) */
import { VideoEffectName } from '@azure/communication-calling';
/* @conditional-compile-remove(video-background-effects) */
import { LocalVideoStreamVideoEffectsState } from './CallClientState';
/* @conditional-compile-remove(raise-hand) */
import { RaisedHand } from '@azure/communication-calling';
/* @conditional-compile-remove(raise-hand) */
import { RaisedHandState } from './CallClientState';

/**
 * @private
 */
export function convertSdkLocalStreamToDeclarativeLocalStream(
  stream: SdkLocalVideoStream
): DeclarativeLocalVideoStream {
  /* @conditional-compile-remove(video-background-effects) */
  const localVideoStreamEffectsAPI = stream.feature(Features.VideoEffects);

  return {
    source: stream.source,
    mediaStreamType: stream.mediaStreamType,
    view: undefined,
    /* @conditional-compile-remove(video-background-effects) */
    videoEffects: convertFromSDKToDeclarativeVideoStreamVideoEffects(localVideoStreamEffectsAPI.activeEffects)
  };
}

/**
 * @private
 */
export function convertSdkRemoteStreamToDeclarativeRemoteStream(
  stream: SdkRemoteVideoStream
): DeclarativeRemoteVideoStream {
  return {
    id: stream.id,
    mediaStreamType: stream.mediaStreamType,
    isAvailable: stream.isAvailable,
    /* @conditional-compile-remove(video-stream-is-receiving-flag) */
    isReceiving: stream.isReceiving,
    view: undefined,
    streamSize: stream.size
  };
}

/**
 * @private
 */
export function convertSdkParticipantToDeclarativeParticipant(
  participant: SdkRemoteParticipant
): DeclarativeRemoteParticipant {
  const declarativeVideoStreams: { [key: number]: DeclarativeRemoteVideoStream } = {};
  for (const videoStream of participant.videoStreams) {
    declarativeVideoStreams[videoStream.id] = convertSdkRemoteStreamToDeclarativeRemoteStream(videoStream);
  }
  return {
    identifier: participant.identifier,
    displayName: participant.displayName,
    state: participant.state,
    callEndReason: participant.callEndReason,
    videoStreams: declarativeVideoStreams,
    isMuted: participant.isMuted,
    isSpeaking: participant.isSpeaking,
    /* @conditional-compile-remove(raise-hand) */
    raisedHand: undefined,
    /* @conditional-compile-remove(hide-attendee-name) */
    role: participant.role,
    /* @conditional-compile-remove(spotlight) */
    spotlight: undefined
  };
}

/**
 * @private
 *
 * Note at the time of writing only one LocalVideoStream is supported by the SDK.
 */
export function convertSdkCallToDeclarativeCall(call: CallCommon): CallState {
  const declarativeRemoteParticipants: { [key: string]: DeclarativeRemoteParticipant } = {};
  call.remoteParticipants.forEach((participant: SdkRemoteParticipant) => {
    declarativeRemoteParticipants[toFlatCommunicationIdentifier(participant.identifier)] =
      convertSdkParticipantToDeclarativeParticipant(participant);
  });
  return {
    id: call.id,
    /* @conditional-compile-remove(teams-identity-support) */
    kind: _isACSCall(call) ? ('Call' as CallKind) : ('TeamsCall' as CallKind),
    callerInfo: call.callerInfo,
    state: call.state,
    callEndReason: call.callEndReason,
    diagnostics: {
      network: {
        latest: {}
      },
      media: {
        latest: {}
      }
    },
    direction: call.direction,
    isMuted: call.isMuted,
    isScreenSharingOn: call.isScreenSharingOn,
    localVideoStreams: call.localVideoStreams.map(convertSdkLocalStreamToDeclarativeLocalStream),
    remoteParticipants: declarativeRemoteParticipants,
    remoteParticipantsEnded: {},
    recording: { isRecordingActive: false },
    /* @conditional-compile-remove(raise-hand) */
    raiseHand: { raisedHands: [] },
    /* @conditional-compile-remove(reaction) */
    localParticipantReaction: undefined,
    transcription: { isTranscriptionActive: false },
    screenShareRemoteParticipant: undefined,
    startTime: new Date(),
    endTime: undefined,
    /* @conditional-compile-remove(rooms) */
    role: call.role,
    /* @conditional-compile-remove(close-captions) */
    captionsFeature: {
      captions: [],
      supportedSpokenLanguages: [],
      supportedCaptionLanguages: [],
      currentCaptionLanguage: '',
      currentSpokenLanguage: '',
      isCaptionsFeatureActive: false,
      startCaptionsInProgress: false
    },
    /* @conditional-compile-remove(call-transfer) */
    transfer: {
      acceptedTransfers: {}
    },
    /* @conditional-compile-remove(optimal-video-count) */
    optimalVideoCount: {
      maxRemoteVideoStreams: call.feature(Features.OptimalVideoCount).optimalVideoCount
    },
    /* @conditional-compile-remove(hide-attendee-name) */
    // TODO: Replace this once the SDK supports hide attendee name
    hideAttendeeNames: true
  };
}

/**
 * @private
 */
export function convertSdkIncomingCallToDeclarativeIncomingCall(call: IncomingCallCommon): DeclarativeIncomingCall {
  return {
    id: call.id,
    callerInfo: call.callerInfo,
    startTime: new Date(),
    endTime: undefined
  };
}

/**
 * @private
 */
export function convertFromSDKToDeclarativeVideoStreamRendererView(
  view: VideoStreamRendererView
): DeclarativeVideoStreamRendererView {
  return {
    scalingMode: view.scalingMode,
    isMirrored: view.isMirrored,
    target: view.target
  };
}

/* @conditional-compile-remove(close-captions) */
/**
 * @private
 */
export function convertFromSDKToCaptionInfoState(caption: TeamsCaptionsInfo): CaptionsInfo {
  return {
    ...caption
  };
}

/* @conditional-compile-remove(video-background-effects) */
/** @private */
export function convertFromSDKToDeclarativeVideoStreamVideoEffects(
  videoEffects: VideoEffectName[]
): LocalVideoStreamVideoEffectsState {
  return {
    activeEffects: videoEffects
  };
}

/* @conditional-compile-remove(raise-hand) */
/**
 * @private
 */
export function convertFromSDKToRaisedHandState(raisedHand: RaisedHand): RaisedHandState {
  return {
    raisedHandOrderPosition: raisedHand.order
  };
}
