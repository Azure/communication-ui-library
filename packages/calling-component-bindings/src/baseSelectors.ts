// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { CallState, DominantSpeakersInfo, EnvironmentInfo } from '@azure/communication-calling';
/* @conditional-compile-remove(breakout-rooms) */
import { BreakoutRoom } from '@azure/communication-calling';
import { ParticipantCapabilities } from '@azure/communication-calling';
import { ParticipantRole } from '@azure/communication-calling';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import {
  CallClientState,
  DeviceManagerState,
  RemoteParticipantState,
  LocalVideoStreamState,
  CallErrors,
  DiagnosticsCallFeatureState,
  SpotlightCallFeatureState,
  IncomingCallState
} from '@internal/calling-stateful-client';
import { TeamsIncomingCallState } from '@internal/calling-stateful-client';
import { ReactionState } from '@internal/calling-stateful-client';
import { CaptionsInfo } from '@internal/calling-stateful-client';

import { CaptionsKind } from '@azure/communication-calling';
import { RaisedHandState } from '@internal/calling-stateful-client';
import { SupportedCaptionLanguage, SupportedSpokenLanguage } from '@internal/react-components';
import { ConferencePhoneInfo } from '@internal/calling-stateful-client';
/* @conditional-compile-remove(breakout-rooms) */ /* @conditional-compile-remove(media-access) */
import { CallNotifications } from '@internal/calling-stateful-client';
/* @conditional-compile-remove(media-access) */
import { CapabilitiesChangeInfo } from '@azure/communication-calling';

/**
 * Common props used to reference calling declarative client state.
 *
 * @public
 */
export type CallingBaseSelectorProps = {
  callId: string;
};

/**
 * @private
 */
export const getDeviceManager = (state: CallClientState): DeviceManagerState => state.deviceManager;

/**
 * @private
 */
export const getRole = (state: CallClientState, props: CallingBaseSelectorProps): ParticipantRole | undefined => {
  return state.calls[props.callId]?.role;
};

/**
 * @private
 */
export const isHideAttendeeNamesEnabled = (state: CallClientState, props: CallingBaseSelectorProps): boolean => {
  return state.calls[props.callId]?.hideAttendeeNames ?? false;
};

/**
 * @private
 */
export const getCapabilities = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): ParticipantCapabilities | undefined => state.calls[props.callId]?.capabilitiesFeature?.capabilities;

/* @conditional-compile-remove(media-access) */
/**
 * @private
 */
export const getLatestCapabilitiesChangedInfo = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): CapabilitiesChangeInfo | undefined => {
  return state.calls[props.callId]?.capabilitiesFeature?.latestCapabilitiesChangeInfo;
};

/**
 * @private
 */
export const getCallExists = (state: CallClientState, props: CallingBaseSelectorProps): boolean =>
  !!state.calls[props.callId];

/**
 * @private
 */
export const getDominantSpeakers = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): undefined | DominantSpeakersInfo => state.calls[props.callId]?.dominantSpeakers;

/**
 * @private
 */
export const getRemoteParticipants = (
  state: CallClientState,
  props: CallingBaseSelectorProps
):
  | {
      [keys: string]: RemoteParticipantState;
    }
  | undefined => {
  return state.calls[props.callId]?.remoteParticipants;
};

/**
 * @private
 */
export const getLocalParticipantRaisedHand = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): RaisedHandState | undefined => {
  return state.calls[props.callId]?.raiseHand?.localParticipantRaisedHand;
};

/**
 * @private
 */
export const getSpotlightCallFeature = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): SpotlightCallFeatureState | undefined => {
  return state.calls[props.callId]?.spotlight;
};

/**
 * @private
 */
export const getLocalParticipantReactionState = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): ReactionState | undefined => {
  return state.calls[props.callId]?.localParticipantReaction;
};

/**
 * @private
 */
export const getIsScreenSharingOn = (state: CallClientState, props: CallingBaseSelectorProps): boolean | undefined =>
  state.calls[props.callId]?.isScreenSharingOn;

/**
 * @private
 */
export const getIsMuted = (state: CallClientState, props: CallingBaseSelectorProps): boolean | undefined =>
  state.calls[props.callId]?.isMuted;

/**
 * @private
 */
export const getOptimalVideoCount = (state: CallClientState, props: CallingBaseSelectorProps): number | undefined =>
  state.calls[props.callId]?.optimalVideoCount.maxRemoteVideoStreams;

/**
 * @private
 */
export const getLocalVideoStreams = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): LocalVideoStreamState[] | undefined => state.calls[props.callId]?.localVideoStreams;

/**
 * @private
 */
export const getScreenShareRemoteParticipant = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): string | undefined => state.calls[props.callId]?.screenShareRemoteParticipant;

/**
 * @private
 */
export const getDisplayName = (state: CallClientState): string | undefined => state.callAgent?.displayName;

/**
 * @private
 */
export const getIdentifier = (state: CallClientState): string => toFlatCommunicationIdentifier(state.userId);

/**
 * @private
 */
export const getLatestErrors = (state: CallClientState): CallErrors => state.latestErrors;

/* @conditional-compile-remove(breakout-rooms) */ /* @conditional-compile-remove(media-access) */
/**
 * @private
 */
export const getLatestNotifications = (state: CallClientState): CallNotifications => state.latestNotifications;

/**
 * @private
 */
export const getDiagnostics = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): DiagnosticsCallFeatureState | undefined => state.calls[props.callId]?.diagnostics;

/**
 * @private
 */
export const getCallState = (state: CallClientState, props: CallingBaseSelectorProps): CallState | undefined =>
  state.calls[props.callId]?.state;

/**
 * @private
 */
export const getEnvironmentInfo = (state: CallClientState): undefined | EnvironmentInfo => {
  return state.environmentInfo;
};

/** @private */
export const getParticipantCount = (state: CallClientState, props: CallingBaseSelectorProps): number | undefined => {
  /* @conditional-compile-remove(total-participant-count) */
  return state.calls[props.callId]?.totalParticipantCount;
  return undefined;
};

/** @private */
export const getCaptionsKind = (state: CallClientState, props: CallingBaseSelectorProps): CaptionsKind | undefined => {
  return state.calls[props.callId]?.captionsFeature.captionsKind;
};

/** @private */
export const getCaptions = (state: CallClientState, props: CallingBaseSelectorProps): CaptionsInfo[] | undefined => {
  return state.calls[props.callId]?.captionsFeature.captions;
};

/** @private */
export const getCaptionsStatus = (state: CallClientState, props: CallingBaseSelectorProps): boolean | undefined => {
  return state.calls[props.callId]?.captionsFeature.isCaptionsFeatureActive;
};

/** @private */
export const getStartCaptionsInProgress = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): boolean | undefined => {
  return state.calls[props.callId]?.captionsFeature.startCaptionsInProgress;
};

/** @private */
export const getCurrentCaptionLanguage = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): SupportedCaptionLanguage | undefined => {
  return state.calls[props.callId]?.captionsFeature.currentCaptionLanguage as SupportedCaptionLanguage;
};

/** @private */
export const getCurrentSpokenLanguage = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): SupportedSpokenLanguage | undefined => {
  return state.calls[props.callId]?.captionsFeature.currentSpokenLanguage as SupportedSpokenLanguage;
};

/** @private */
export const getSupportedCaptionLanguages = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): SupportedCaptionLanguage[] | undefined => {
  return state.calls[props.callId]?.captionsFeature.supportedCaptionLanguages as SupportedCaptionLanguage[];
};

/** @private */
export const getSupportedSpokenLanguages = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): SupportedSpokenLanguage[] | undefined => {
  return state.calls[props.callId]?.captionsFeature.supportedSpokenLanguages as SupportedSpokenLanguage[];
};

/** @private */
export const getMeetingConferencePhones = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): ConferencePhoneInfo[] | undefined => {
  return state.calls[props.callId]?.meetingConference?.conferencePhones;
};

/**
 * selector for retrieving the incoming calls from state
 * @returns the incoming calls in the call client state
 * @private
 */
export const getIncomingCalls = (state: CallClientState): IncomingCallState[] | TeamsIncomingCallState[] => {
  return Object.values(state.incomingCalls);
};

/**
 * selector for retrieving the incoming calls that have been removed from state
 * @returns the incoming calls that have been removed
 * @private
 */
export const getRemovedIncomingCalls = (state: CallClientState): IncomingCallState[] | TeamsIncomingCallState[] => {
  return Object.values(state.incomingCallsEnded);
};

/* @conditional-compile-remove(breakout-rooms) */
/** @private */
export const getAssignedBreakoutRoom = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): BreakoutRoom | undefined => {
  return state.calls[props.callId]?.breakoutRooms?.assignedBreakoutRoom;
};

/* @conditional-compile-remove(rtt) */
/** @private */
export const getRealTimeTextStatus = (state: CallClientState, props: CallingBaseSelectorProps): boolean | undefined => {
  return state.calls[props.callId]?.captionsFeature.isRealTimeTextFeatureActive;
};
