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
/* @conditional-compile-remove(acs-close-captions) */
import { CaptionsInfo as AcsCaptionsInfo } from '@azure/communication-calling';
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

import { Features } from '@azure/communication-calling';

import { VideoEffectName } from '@azure/communication-calling';

import { LocalVideoStreamVideoEffectsState } from './CallClientState';
import { RaisedHand } from '@azure/communication-calling';
import { RaisedHandState } from './CallClientState';

/**
 * @private
 */
export function convertSdkLocalStreamToDeclarativeLocalStream(
  stream: SdkLocalVideoStream
): DeclarativeLocalVideoStream {
  const localVideoStreamEffectsAPI = stream.feature(Features.VideoEffects);

  return {
    source: stream.source,
    mediaStreamType: stream.mediaStreamType,
    view: undefined,

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
    /* @conditional-compile-remove(local-recording-notification) */
    localRecording: { isLocalRecordingActive: false },
    /* @conditional-compile-remove(ppt-live) */
    pptLive: { isActive: false },
    raiseHand: { raisedHands: [] },
    /* @conditional-compile-remove(reaction) */
    localParticipantReaction: undefined,
    transcription: { isTranscriptionActive: false },
    screenShareRemoteParticipant: undefined,
    startTime: new Date(),
    endTime: undefined,
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
    optimalVideoCount: {
      maxRemoteVideoStreams: call.feature(Features.OptimalVideoCount).optimalVideoCount
    },
    /* @conditional-compile-remove(hide-attendee-name) */
    // TODO: Replace this once the SDK supports hide attendee name
    hideAttendeeNames: false
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
export function convertFromTeamsSDKToCaptionInfoState(caption: TeamsCaptionsInfo): CaptionsInfo {
  return {
    ...caption
  };
}

/* @conditional-compile-remove(acs-close-captions) */
/**
 * @private
 */
export function convertFromSDKToCaptionInfoState(caption: AcsCaptionsInfo): CaptionsInfo {
  return {
    captionText: caption.spokenText,
    ...caption
  };
}

/** @private */
export function convertFromSDKToDeclarativeVideoStreamVideoEffects(
  videoEffects: VideoEffectName[]
): LocalVideoStreamVideoEffectsState {
  return {
    activeEffects: videoEffects
  };
}

/**
 * @private
 */
export function convertFromSDKToRaisedHandState(raisedHand: RaisedHand): RaisedHandState {
  return {
    raisedHandOrderPosition: raisedHand.order
  };
}
