// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { DominantSpeakersInfo } from '@azure/communication-calling';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import {
  CallState,
  CallClientState,
  DeviceManagerState,
  IncomingCallState,
  RemoteParticipantState,
  LocalVideoStreamState,
  CallErrors,
  DiagnosticsCallFeatureState
} from '@internal/calling-stateful-client';

/**
 * Common props used to reference calling declarative client state.
 */
export type CallingBaseSelectorProps = {
  callId: string;
};

export const getCalls = (state: CallClientState): { [key: string]: CallState } => state.calls;

export const getCallsEnded = (state: CallClientState): CallState[] => state.callsEnded;

export const getIncomingCalls = (state: CallClientState): { [key: string]: IncomingCallState } => state.incomingCalls;

export const getIncomingCallsEnded = (state: CallClientState): IncomingCallState[] => state.incomingCallsEnded;

export const getDeviceManager = (state: CallClientState): DeviceManagerState => state.deviceManager;

export const getCallExists = (state: CallClientState, props: CallingBaseSelectorProps): boolean =>
  !!state.calls[props.callId];

export const getDominantSpeakers = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): undefined | DominantSpeakersInfo => state.calls[props.callId]?.dominantSpeakers;

export const getRemoteParticipants = (
  state: CallClientState,
  props: CallingBaseSelectorProps
):
  | undefined
  | {
      [keys: string]: RemoteParticipantState;
    } => state.calls[props.callId]?.remoteParticipants;

export const getIsScreenSharingOn = (state: CallClientState, props: CallingBaseSelectorProps): boolean | undefined =>
  state.calls[props.callId]?.isScreenSharingOn;

export const getIsMuted = (state: CallClientState, props: CallingBaseSelectorProps): boolean | undefined =>
  state.calls[props.callId]?.isMuted;

export const getLocalVideoStreams = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): LocalVideoStreamState[] | undefined => state.calls[props.callId]?.localVideoStreams;

export const getScreenShareRemoteParticipant = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): string | undefined => state.calls[props.callId]?.screenShareRemoteParticipant;

export const getDisplayName = (state: CallClientState): string | undefined => state.callAgent?.displayName;

export const getIdentifier = (state: CallClientState): string => toFlatCommunicationIdentifier(state.userId);

export const getLatestErrors = (state: CallClientState): CallErrors => state.latestErrors;

export const getDiagnostics = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): DiagnosticsCallFeatureState | undefined => state.calls[props.callId]?.diagnostics;
