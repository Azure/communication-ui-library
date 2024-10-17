// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  CallState as SDKCallStatus,
  DominantSpeakersInfo,
  ParticipantCapabilities,
  ParticipantRole,
  VideoDeviceInfo,
  AudioDeviceInfo,
  CapabilitiesChangeInfo,
  EnvironmentInfo
} from '@azure/communication-calling';

/* @conditional-compile-remove(breakout-rooms) */
import { BreakoutRoom, BreakoutRoomsSettings } from '@azure/communication-calling';
import {
  CallState,
  DeviceManagerState,
  DiagnosticsCallFeatureState,
  LocalVideoStreamState,
  RemoteParticipantState
} from '@internal/calling-stateful-client';
import { CaptionsInfo } from '@internal/calling-stateful-client';
import { ConferencePhoneInfo } from '@internal/calling-stateful-client';
import { SpotlightedParticipant } from '@azure/communication-calling';
import { CallAdapterState, CallCompositePage, VideoBackgroundImage } from '../adapter/CallAdapter';

import { VideoBackgroundEffect } from '../adapter/CallAdapter';
import {
  _isInCall,
  _isPreviewOn,
  _dominantSpeakersWithFlatId,
  VideoBackgroundEffectsDependency
} from '@internal/calling-component-bindings';
/* @conditional-compile-remove(DNS) */
import { DeepNoiseSuppressionEffectDependency } from '@internal/calling-component-bindings';
import { AdapterErrors } from '../../common/adapters';
/* @conditional-compile-remove(breakout-rooms) */
import { AdapterNotifications } from '../../common/adapters';
import { RaisedHandState } from '@internal/calling-stateful-client';
import { CommunicationIdentifier } from '@azure/communication-common';

import { CaptionsKind } from '@azure/communication-calling';
import { ReactionResources } from '@internal/react-components';

/**
 * @private
 */
export const getDisplayName = (state: CallAdapterState): string | undefined => state.displayName;

/**
 * @private
 */
export const getCallId = (state: CallAdapterState): string | undefined => state.call?.id;

/**
 * @private
 */
export const getEndedCall = (state: CallAdapterState): CallState | undefined => state.endedCall;

/**
 * @private
 */
export const getCallStatus = (state: CallAdapterState): SDKCallStatus => state.call?.state ?? 'None';

/**
 * @private
 */
export const getDeviceManager = (state: CallAdapterState): DeviceManagerState => state.devices;

/**
 * @private
 */
export const getIsScreenShareOn = (state: CallAdapterState): boolean => state.call?.isScreenSharingOn ?? false;

/**
 * @private
 */
export const getLocalParticipantRaisedHand = (state: CallAdapterState): RaisedHandState | undefined =>
  state.call?.raiseHand.localParticipantRaisedHand;

/**
 * @private
 */
export const getCapabilites = (state: CallAdapterState): ParticipantCapabilities | undefined =>
  state.call?.capabilitiesFeature?.capabilities;

/**
 * @private
 */
export const getIsPreviewCameraOn = (state: CallAdapterState): boolean => _isPreviewOn(state.devices);

/**
 * @private
 */
export const getMicrophones = (state: CallAdapterState): AudioDeviceInfo[] => state.devices.microphones;

/**
 * @private
 */
export const getCameras = (state: CallAdapterState): VideoDeviceInfo[] => state.devices.cameras;

/**
 * @private
 */
export const getRole = (state: CallAdapterState): ParticipantRole | undefined => state.call?.role;

/**
 * @private
 */
export const getPage = (state: CallAdapterState): CallCompositePage => state.page;

/**
 * @private
 */
export const getTransferCall = (state: CallAdapterState): CallState | undefined => state.acceptedTransferCallState;

/**
 * @private
 */
export const getLocalMicrophoneEnabled = (state: CallAdapterState): boolean => state.isLocalPreviewMicrophoneEnabled;

/**
 * @private
 */
export const getLocalVideoStreams = (state: CallAdapterState): LocalVideoStreamState[] | undefined =>
  state.call?.localVideoStreams;

/**
 * @private
 */
export const getIsTranscriptionActive = (state: CallAdapterState): boolean =>
  !!state.call?.transcription.isTranscriptionActive;

/**
 * @private
 */
export const getIsRecordingActive = (state: CallAdapterState): boolean => !!state.call?.recording.isRecordingActive;

/**
 * @private
 */
export const getUserFacingDiagnostics = (state: CallAdapterState): DiagnosticsCallFeatureState | undefined =>
  state.call?.diagnostics;

/**
 * @private
 */
export const getDominantSpeakerInfo = (state: CallAdapterState): undefined | DominantSpeakersInfo =>
  state.call?.dominantSpeakers;

/**
 * @private
 */
export const getRemoteParticipants = (
  state: CallAdapterState
):
  | undefined
  | {
      [keys: string]: RemoteParticipantState;
    } => state.call?.remoteParticipants;

/**
 * @private
 */
export const getEnvironmentInfo = (state: CallAdapterState): EnvironmentInfo | undefined => state.environmentInfo;

/**
 * @private
 */
export const getSelectedVideoEffect = (state: CallAdapterState): VideoBackgroundEffect | undefined =>
  state.selectedVideoBackgroundEffect;

/** @private */
export const getCaptionsKind = (state: CallAdapterState): CaptionsKind | undefined => {
  return state.call?.captionsFeature.captionsKind;
};

/** @private */
export const getCaptions = (state: CallAdapterState): CaptionsInfo[] | undefined => {
  return state.call?.captionsFeature.captions;
};

/** @private */
export const getCaptionsStatus = (state: CallAdapterState): boolean | undefined => {
  return state.call?.captionsFeature.isCaptionsFeatureActive;
};

/** @private */
export const getCurrentCaptionLanguage = (state: CallAdapterState): string | undefined => {
  return state.call?.captionsFeature.currentCaptionLanguage;
};

/** @private */
export const getCurrentSpokenLanguage = (state: CallAdapterState): string | undefined => {
  return state.call?.captionsFeature.currentSpokenLanguage;
};

/** @private */
export const getSupportedCaptionLanguages = (state: CallAdapterState): string[] | undefined => {
  return state.call?.captionsFeature.supportedCaptionLanguages;
};

/** @private */
export const getSupportedSpokenLanguages = (state: CallAdapterState): string[] | undefined => {
  return state.call?.captionsFeature.supportedSpokenLanguages;
};

/**
 * @private
 */
export const getIsTeamsCall = (state: CallAdapterState): boolean => state.isTeamsCall;

/**
 * @private
 */
export const getIsTeamsMeeting = (state: CallAdapterState): boolean => state.isTeamsMeeting;

/**
 * @private
 */
export const getTeamsMeetingCoordinates = (state: CallAdapterState): ConferencePhoneInfo[] | undefined =>
  state.call?.meetingConference?.conferencePhones;

/**
 * @private
 */
export const getLatestErrors = (state: CallAdapterState): AdapterErrors => state.latestErrors;

/**
 * @private
 */
export const getLatestCapabilitiesChangedInfo = (state: CallAdapterState): CapabilitiesChangeInfo | undefined => {
  return state.call?.capabilitiesFeature?.latestCapabilitiesChangeInfo;
};

/**
 * @private
 */
export const getTargetCallees = (state: CallAdapterState): CommunicationIdentifier[] | undefined => state.targetCallees;

/**
 * @private
 */
export const getStartTime = (state: CallAdapterState): Date | undefined => state.call?.startTime;

/**
 * @private
 */
export const getSpotlightedParticipants = (state: CallAdapterState): SpotlightedParticipant[] | undefined =>
  state.call?.spotlight?.spotlightedParticipants;

/* @conditional-compile-remove(breakout-rooms) */
/**
 * @private
 */
export const getAssignedBreakoutRoom = (state: CallAdapterState): BreakoutRoom | undefined =>
  state.call?.breakoutRooms?.assignedBreakoutRoom;

/* @conditional-compile-remove(breakout-rooms) */
/**
 * @private
 */
export const getBreakoutRoomSettings = (state: CallAdapterState): BreakoutRoomsSettings | undefined =>
  state.call?.breakoutRooms?.breakoutRoomSettings;

/* @conditional-compile-remove(breakout-rooms) */
/**
 * @private
 */
export const getBreakoutRoomDisplayName = (state: CallAdapterState): string | undefined =>
  state.call?.breakoutRooms?.breakoutRoomDisplayName;

/* @conditional-compile-remove(breakout-rooms) */
/**
 * @private
 */
export const getLatestNotifications = (state: CallAdapterState): AdapterNotifications => state.latestNotifications;

/** @private */
export const getVideoEffectsDependency = (
  state: CallAdapterState
): (() => Promise<VideoBackgroundEffectsDependency>) | undefined => state.onResolveVideoEffectDependency;

/* @conditional-compile-remove(DNS) */
/** @private */
export const getDeepNoiseSuppresionEffectsDependency = (
  state: CallAdapterState
): (() => Promise<DeepNoiseSuppressionEffectDependency>) | undefined => state.onResolveDeepNoiseSuppressionDependency;

/* @conditional-compile-remove(DNS) */
/** @private */
export const getDeepNoiseSuppresionIsOnByDefault = (state: CallAdapterState): boolean | undefined =>
  state.deepNoiseSuppressionOnByDefault;

/* @conditional-compile-remove(DNS) */
/** @private */
export const getHideDeepNoiseSupressionButton = (state: CallAdapterState): boolean | undefined =>
  state.hideDeepNoiseSuppressionButton;

/** @private */
export const getReactionResources = (state: CallAdapterState): ReactionResources | undefined => state.reactions;

/** @private */
export const getAlternateCallerId = (state: CallAdapterState): string | undefined => state.alternateCallerId;

/** @private */
export const getIsRoomsCall = (state: CallAdapterState): boolean => state.isRoomsCall;

/** @private */
export const getVideoBackgroundImages = (state: CallAdapterState): VideoBackgroundImage[] | undefined =>
  state.videoBackgroundImages;
