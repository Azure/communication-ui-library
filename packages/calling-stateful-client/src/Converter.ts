// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  RemoteParticipant as SdkRemoteParticipant,
  RemoteVideoStream as SdkRemoteVideoStream,
  LocalVideoStream as SdkLocalVideoStream,
  VideoStreamRendererView,
  Call,
  CallAgent
} from '@azure/communication-calling';

import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { CallAgentCommon, CallCommon, IncomingCallCommon, TeamsCall, TeamsCallAgent } from './BetaToStableTypes';
import {
  CallState,
  RemoteParticipantState as DeclarativeRemoteParticipant,
  RemoteVideoStreamState as DeclarativeRemoteVideoStream,
  LocalVideoStreamState as DeclarativeLocalVideoStream,
  IncomingCallState as DeclarativeIncomingCall,
  VideoStreamRendererViewState as DeclarativeVideoStreamRendererView
} from './CallClientState';

/**
 * @private
 */
export function convertSdkLocalStreamToDeclarativeLocalStream(
  stream: SdkLocalVideoStream
): DeclarativeLocalVideoStream {
  return {
    source: stream.source,
    mediaStreamType: stream.mediaStreamType,
    view: undefined
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
    view: undefined
  };
}

/**
 * @private
 */
export function convertSdkParticipantToDeclarativeParticipant(
  participant: SdkRemoteParticipant
): DeclarativeRemoteParticipant {
  const declarativeVideoStreams = {};
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
    isSpeaking: participant.isSpeaking
  };
}

/**
 * @private
 *
 * Note at the time of writing only one LocalVideoStream is supported by the SDK.
 */
export function convertSdkCallToDeclarativeCall(call: CallCommon): CallState {
  const declarativeRemoteParticipants = {};
  call.remoteParticipants.forEach((participant: SdkRemoteParticipant) => {
    declarativeRemoteParticipants[toFlatCommunicationIdentifier(participant.identifier)] =
      convertSdkParticipantToDeclarativeParticipant(participant);
  });
  return {
    id: call.id,
    /* @conditional-compile-remove(teams-identity-support) */
    type: isACSCall(call) ? 'ACS' : 'Teams',
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
    transcription: { isTranscriptionActive: false },
    screenShareRemoteParticipant: undefined,
    startTime: new Date(),
    endTime: undefined,
    /* @conditional-compile-remove(rooms) */
    role: call.role
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

/**
 * @private
 */
export const isACSCall = (call: CallCommon): call is Call => {
  /* @conditional-compile-remove(teams-identity-support) */
  return call.kind === 'Call';
  return true;
};

/**
 * @private
 */
export const isACSCallAgent = (callAgent: CallAgentCommon): callAgent is CallAgent => {
  /* @conditional-compile-remove(teams-identity-support) */
  return callAgent.kind === 'CallAgent';
  return true;
};

/**
 * @private
 */
export const isTeamsCall = (call: CallCommon): call is TeamsCall => {
  /* @conditional-compile-remove(teams-identity-support) */
  return call.kind === 'TeamsCall';
  return false;
};

/**
 * @private
 */
export const isTeamsCallAgent = (callAgent: CallAgentCommon): callAgent is TeamsCallAgent => {
  /* @conditional-compile-remove(teams-identity-support) */
  return callAgent.kind === 'TeamsCallAgent';
  return false;
};
