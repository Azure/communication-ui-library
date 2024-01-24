// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallState as SDKCallStatus, DominantSpeakersInfo } from '@azure/communication-calling';
import { ParticipantCapabilities } from '@azure/communication-calling';
import { VideoDeviceInfo, AudioDeviceInfo } from '@azure/communication-calling';
/* @conditional-compile-remove(capabilities) */
import { CapabilitiesChangeInfo } from '@azure/communication-calling';
/* @conditional-compile-remove(unsupported-browser) */
import { EnvironmentInfo } from '@azure/communication-calling';
/* @conditional-compile-remove(capabilities) */
import { ParticipantRole } from '@azure/communication-calling';
import {
  CallState,
  DeviceManagerState,
  DiagnosticsCallFeatureState,
  LocalVideoStreamState,
  RemoteParticipantState
} from '@internal/calling-stateful-client';
/* @conditional-compile-remove(close-captions) */
import { CaptionsInfo } from '@internal/calling-stateful-client';
import { CallAdapterState, CallCompositePage } from '../adapter/CallAdapter';
/* @conditional-compile-remove(video-background-effects) */
import { VideoBackgroundEffect } from '../adapter/CallAdapter';
import { _isInCall, _isPreviewOn, _dominantSpeakersWithFlatId } from '@internal/calling-component-bindings';
import { AdapterErrors } from '../../common/adapters';
/* @conditional-compile-remove(raise-hand) */
import { RaisedHandState } from '@internal/calling-stateful-client';
import { CommunicationIdentifier } from '@azure/communication-common';
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

/* @conditional-compile-remove(raise-hand) */
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

/* @conditional-compile-remove(capabilities) */
/**
 * @private
 */
export const getRole = (state: CallAdapterState): ParticipantRole | undefined => state.call?.role;

/**
 * @private
 */
export const getPage = (state: CallAdapterState): CallCompositePage => state.page;

/* @conditional-compile-remove(call-transfer) */
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

/* @conditional-compile-remove(unsupported-browser) */
/**
 * @private
 */
export const getEnvironmentInfo = (state: CallAdapterState): EnvironmentInfo | undefined => state.environmentInfo;

/* @conditional-compile-remove(video-background-effects) */
/**
 * @private
 */
export const getSelectedVideoEffect = (state: CallAdapterState): VideoBackgroundEffect | undefined =>
  state.selectedVideoBackgroundEffect;

/* @conditional-compile-remove(close-captions) */
/** @private */
export const getCaptions = (state: CallAdapterState): CaptionsInfo[] | undefined => {
  return state.call?.captionsFeature.captions;
};

/* @conditional-compile-remove(close-captions) */
/** @private */
export const getCaptionsStatus = (state: CallAdapterState): boolean | undefined => {
  return state.call?.captionsFeature.isCaptionsFeatureActive;
};

/* @conditional-compile-remove(close-captions) */
/** @private */
export const getCurrentCaptionLanguage = (state: CallAdapterState): string | undefined => {
  return state.call?.captionsFeature.currentCaptionLanguage;
};

/* @conditional-compile-remove(close-captions) */
/** @private */
export const getCurrentSpokenLanguage = (state: CallAdapterState): string | undefined => {
  return state.call?.captionsFeature.currentSpokenLanguage;
};

/* @conditional-compile-remove(close-captions) */
/** @private */
export const getSupportedCaptionLanguages = (state: CallAdapterState): string[] | undefined => {
  return state.call?.captionsFeature.supportedCaptionLanguages;
};

/* @conditional-compile-remove(close-captions) */
/** @private */
export const getSupportedSpokenLanguages = (state: CallAdapterState): string[] | undefined => {
  return state.call?.captionsFeature.supportedSpokenLanguages;
};

/* @conditional-compile-remove(close-captions) */
/**
 * @private
 */
export const getIsTeamsCall = (state: CallAdapterState): boolean => state.isTeamsCall;

/**
 * @private
 */
export const getLatestErrors = (state: CallAdapterState): AdapterErrors => state.latestErrors;

/* @conditional-compile-remove(capabilities) */
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
