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
/* @conditional-compile-remove(one-to-n-calling) */
import { TeamsIncomingCall } from '@azure/communication-calling';
import { TeamsCaptionsInfo } from '@azure/communication-calling';
/* @conditional-compile-remove(acs-close-captions) */
import { CaptionsInfo as AcsCaptionsInfo } from '@azure/communication-calling';
/* @conditional-compile-remove(teams-identity-support) */
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
/* @conditional-compile-remove(one-to-n-calling) */
import { TeamsIncomingCallState as DeclarativeTeamsIncomingCall } from './CallClientState';
/* @conditional-compile-remove(one-to-n-calling) */
import { _isTeamsIncomingCall } from './TypeGuards';
import { _isACSCall } from './TypeGuards';
/* @conditional-compile-remove(acs-close-captions) */
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
  /* @conditional-compile-remove(hide-attendee-name) */
  let hideAttendeeNames = false;
  /* @conditional-compile-remove(hide-attendee-name) */
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

  /* @conditional-compile-remove(DNS) */
  let isDeepNoiseSuppressionOn;
  /* @conditional-compile-remove(DNS) */
  const audioStream = call?.localAudioStreams.find((stream) => stream.mediaStreamType === 'Audio');
  /* @conditional-compile-remove(DNS) */
  if (audioStream) {
    const activeAudioEffects = audioStream.feature(Features.AudioEffects).activeEffects;
    if (activeAudioEffects && activeAudioEffects.noiseSuppression.includes('DeepNoiseSuppression')) {
      isDeepNoiseSuppressionOn = true;
    } else {
      isDeepNoiseSuppressionOn = false;
    }
  }

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
    pptLive: { isActive: false },
    raiseHand: { raisedHands: [] },
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
      /* @conditional-compile-remove(acs-close-captions) */
      captionsKind: _isTeamsCall(call) ? 'TeamsCaptions' : 'Captions'
    },
    transfer: {
      acceptedTransfers: {}
    },
    optimalVideoCount: {
      maxRemoteVideoStreams: call.feature(Features.OptimalVideoCount).optimalVideoCount
    },
    /* @conditional-compile-remove(hide-attendee-name) */
    hideAttendeeNames,
    info: callInfo,
    /* @conditional-compile-remove(teams-meeting-conference) */
    meetingConference: { conferencePhones: [] },
    /* @conditional-compile-remove(DNS) */
    isDeepNoiseSuppressionOn
  };
}

/**
 * @private
 */
export function convertSdkIncomingCallToDeclarativeIncomingCall(
  call: IncomingCallCommon
): DeclarativeIncomingCall | /* @conditional-compile-remove(one-to-n-calling) */ DeclarativeTeamsIncomingCall {
  /* @conditional-compile-remove(one-to-n-calling) */
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
