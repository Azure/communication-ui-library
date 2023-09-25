// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { DominantSpeakersInfo } from '@azure/communication-calling';
/* @conditional-compile-remove(capabilities) */
import { ParticipantCapabilities } from '@azure/communication-calling';
/* @conditional-compile-remove(unsupported-browser) */
import { EnvironmentInfo } from '@azure/communication-calling';
import { ParticipantRole } from '@azure/communication-calling';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import {
  CallClientState,
  DeviceManagerState,
  RemoteParticipantState,
  LocalVideoStreamState,
  CallErrors,
  DiagnosticsCallFeatureState
} from '@internal/calling-stateful-client';
/* @conditional-compile-remove(close-captions) */
import { CaptionsInfo } from '@internal/calling-stateful-client';
/* @conditional-compile-remove(raise-hand) */
import { RaisedHandState } from '@internal/calling-stateful-client';

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
  /* @conditional-compile-remove(rooms) */
  return state.calls[props.callId]?.role;
  return 'Unknown';
};

/* @conditional-compile-remove(capabilities) */
/**
 * @private
 */
export const getCapabilites = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): ParticipantCapabilities | undefined => state.calls[props.callId]?.capabilitiesFeature?.capabilities;

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

/* @conditional-compile-remove(raise-hand) */
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
export const getIsScreenSharingOn = (state: CallClientState, props: CallingBaseSelectorProps): boolean | undefined =>
  state.calls[props.callId]?.isScreenSharingOn;

/**
 * @private
 */
export const getIsMuted = (state: CallClientState, props: CallingBaseSelectorProps): boolean | undefined =>
  state.calls[props.callId]?.isMuted;

/* @conditional-compile-remove(optimal-video-count) */
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

/**
 * @private
 */
export const getDiagnostics = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): DiagnosticsCallFeatureState | undefined => state.calls[props.callId]?.diagnostics;

/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(raise-hand) */
/**
 * @private
 */
export const getCallState = (state: CallClientState, props: CallingBaseSelectorProps): string =>
  state.calls[props.callId]?.state;

/**
 * @private
 */
export const getEnvironmentInfo = (
  state: CallClientState
): undefined | /* @conditional-compile-remove(unsupported-browser) */ EnvironmentInfo => {
  /* @conditional-compile-remove(unsupported-browser) */
  return state.environmentInfo;
  return undefined;
};

/** @private */
export const getParticipantCount = (state: CallClientState, props: CallingBaseSelectorProps): number | undefined => {
  /* @conditional-compile-remove(total-participant-count) */
  return state.calls[props.callId]?.totalParticipantCount;
  return undefined;
};

/* @conditional-compile-remove(close-captions) */
/** @private */
export const getCaptions = (state: CallClientState, props: CallingBaseSelectorProps): CaptionsInfo[] | undefined => {
  return state.calls[props.callId]?.captionsFeature.captions;
};

/* @conditional-compile-remove(close-captions) */
/** @private */
export const getCaptionsStatus = (state: CallClientState, props: CallingBaseSelectorProps): boolean | undefined => {
  return state.calls[props.callId]?.captionsFeature.isCaptionsFeatureActive;
};

/* @conditional-compile-remove(close-captions) */
/** @private */
export const getStartCaptionsInProgress = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): boolean | undefined => {
  return state.calls[props.callId]?.captionsFeature.startCaptionsInProgress;
};

/* @conditional-compile-remove(close-captions) */
/** @private */
export const getCurrentCaptionLanguage = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): string | undefined => {
  return state.calls[props.callId]?.captionsFeature.currentCaptionLanguage;
};

/* @conditional-compile-remove(close-captions) */
/** @private */
export const getCurrentSpokenLanguage = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): string | undefined => {
  return state.calls[props.callId]?.captionsFeature.currentSpokenLanguage;
};

/* @conditional-compile-remove(close-captions) */
/** @private */
export const getSupportedCaptionLanguages = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): string[] | undefined => {
  return state.calls[props.callId]?.captionsFeature.supportedCaptionLanguages;
};

/* @conditional-compile-remove(close-captions) */
/** @private */
export const getSupportedSpokenLanguages = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): string[] | undefined => {
  return state.calls[props.callId]?.captionsFeature.supportedSpokenLanguages;
};
