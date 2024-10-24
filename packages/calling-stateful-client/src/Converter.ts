// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  RemoteParticipant as SdkRemoteParticipant,
  RemoteVideoStream as SdkRemoteVideoStream,
  LocalVideoStream as SdkLocalVideoStream,
  VideoStreamRendererView,
  IncomingCall,
  IncomingCallCommon
} from '@azure/communication-calling';
import { TeamsIncomingCall } from '@azure/communication-calling';
import { TeamsCaptionsInfo } from '@azure/communication-calling';
import { CaptionsInfo as AcsCaptionsInfo } from '@azure/communication-calling';
import { CallKind } from '@azure/communication-calling';
import { TeamsCallInfo } from '@azure/communication-calling';
/* @conditional-compile-remove(calling-beta-sdk) */
import { CallInfo } from '@azure/communication-calling';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import {
  CallState,
  RemoteParticipantState as DeclarativeRemoteParticipant,
  RemoteVideoStreamState as DeclarativeRemoteVideoStream,
  LocalVideoStreamState as DeclarativeLocalVideoStream,
  IncomingCallState as DeclarativeIncomingCall,
  VideoStreamRendererViewState as DeclarativeVideoStreamRendererView,
  CallInfoState
} from './CallClientState';
import { CaptionsInfo } from './CallClientState';
import { TeamsIncomingCallState as DeclarativeTeamsIncomingCall } from './CallClientState';
import { _isTeamsIncomingCall } from './TypeGuards';
import { _isACSCall } from './TypeGuards';
import { _isTeamsCall } from './TypeGuards';
import { CallCommon } from './BetaToStableTypes';
import { Features } from '@azure/communication-calling';
import { VideoEffectName } from '@azure/communication-calling';
import { LocalVideoStreamVideoEffectsState } from './CallClientState';
import { RaisedHand } from '@azure/communication-calling';
import { RaisedHandState } from './CallClientState';
import { TeamsMeetingAudioConferencingDetails } from '@azure/communication-calling';
import { ConferencePhoneInfo } from './CallClientState';

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
    role: participant.role,
    spotlight: undefined,
    /* @conditional-compile-remove(media-access) */ mediaAccess: undefined
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
  let hideAttendeeNames = false;
  if (
    call.feature(Features.Capabilities).capabilities &&
    call.feature(Features.Capabilities).capabilities.viewAttendeeNames
  ) {
    const viewAttendeeNames = call.feature(Features.Capabilities).capabilities.viewAttendeeNames;
    if (!viewAttendeeNames.isPresent && viewAttendeeNames.reason === 'MeetingRestricted') {
      hideAttendeeNames = true;
    }
  }

  let callInfo: TeamsCallInfo | undefined | /* @conditional-compile-remove(calling-beta-sdk) */ CallInfo;
  if ('info' in call) {
    callInfo = call.info as TeamsCallInfo | undefined | /* @conditional-compile-remove(calling-beta-sdk) */ CallInfo;
  }

  return {
    id: call.id,

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
    pptLive: { isActive: false },
    raiseHand: { raisedHands: [] },
    /* @conditional-compile-remove(together-mode) */
    togetherMode: { stream: [] },
    localParticipantReaction: undefined,
    transcription: { isTranscriptionActive: false },
    screenShareRemoteParticipant: undefined,
    startTime: new Date(),
    endTime: undefined,
    role: call.role,
    captionsFeature: {
      captions: [],
      supportedSpokenLanguages: [],
      supportedCaptionLanguages: [],
      currentCaptionLanguage: '',
      currentSpokenLanguage: '',
      isCaptionsFeatureActive: false,
      startCaptionsInProgress: false,

      captionsKind: _isTeamsCall(call) ? 'TeamsCaptions' : 'Captions'
    },
    transfer: {
      acceptedTransfers: {}
    },
    optimalVideoCount: {
      maxRemoteVideoStreams: call.feature(Features.OptimalVideoCount).optimalVideoCount
    },
    hideAttendeeNames,
    info: callInfo,
    meetingConference: { conferencePhones: [] }
  };
}

/**
 * @private
 */
export function convertSdkIncomingCallToDeclarativeIncomingCall(
  call: IncomingCallCommon
): DeclarativeIncomingCall | DeclarativeTeamsIncomingCall {
  if (_isTeamsIncomingCall(call)) {
    const newInfo: CallInfoState = { ...(call as TeamsIncomingCall).info, kind: call.kind };
    return {
      id: call.id,
      info: newInfo,
      callerInfo: call.callerInfo,
      startTime: new Date(),
      endTime: undefined
    };
  } else {
    const newInfo: CallInfoState = { ...(call as IncomingCall).info, kind: call.kind };
    return {
      id: call.id,
      info: newInfo,
      callerInfo: call.callerInfo,
      startTime: new Date(),
      endTime: undefined
    };
  }
  const newInfo: CallInfoState = { ...(call as IncomingCall).info, kind: call.kind };
  return {
    id: call.id,
    info: newInfo,
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
export function convertFromTeamsSDKToCaptionInfoState(caption: TeamsCaptionsInfo): CaptionsInfo {
  return {
    ...caption
  };
}

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

/** @private */
export function convertConferencePhoneInfo(
  meetingConferencePhoneInfo?: TeamsMeetingAudioConferencingDetails
): ConferencePhoneInfo[] {
  if (!meetingConferencePhoneInfo) {
    return [];
  }

  return meetingConferencePhoneInfo.phoneNumbers.flatMap((phoneNumber) => {
    const common = {
      conferenceId: meetingConferencePhoneInfo.phoneConferenceId,
      country: phoneNumber.countryName,
      city: phoneNumber.cityName,
      phoneNumber: '',
      isTollFree: false
    };
    const toll = Object.assign({}, common);
    toll.phoneNumber = phoneNumber.tollPhoneNumber?.phoneNumber ?? '';
    toll.isTollFree = false;

    const tollFree = Object.assign({}, common);
    tollFree.phoneNumber = phoneNumber.tollFreePhoneNumber?.phoneNumber ?? '';
    tollFree.isTollFree = true;

    return [toll, tollFree].filter((phoneInfo) => phoneInfo.phoneNumber);
  });
}
