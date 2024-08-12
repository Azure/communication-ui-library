// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export { createStatefulCallClient } from './StatefulCallClient';
export type { StatefulCallClient, StatefulCallClientArgs, StatefulCallClientOptions } from './StatefulCallClient';
export type { StatefulDeviceManager } from './DeviceManagerDeclarative';
export type {
  CallAgentState,
  CallClientState,
  CallError,
  CallErrors,
  CallErrorTarget,
  CallState,
  DeviceManagerState,
  DiagnosticsCallFeatureState,
  IncomingCallState,
  LocalVideoStreamState,
  MediaDiagnosticsState,
  NetworkDiagnosticsState,
  RecordingCallFeatureState as RecordingCallFeature,
  RemoteParticipantState,
  RemoteVideoStreamState,
  TranscriptionCallFeatureState as TranscriptionCallFeature,
  VideoStreamRendererViewState,
  CallInfoState
} from './CallClientState';
/* @conditional-compile-remove(breakout-rooms) */
export type { CallNotification, CallNotifications, NotificationTarget } from './CallClientState';
/* @conditional-compile-remove(one-to-n-calling) */
export type { TeamsIncomingCallState } from './CallClientState';
/* @conditional-compile-remove(remote-ufd) */
export type { RemoteDiagnosticState } from './CallClientState';
export type { CreateViewResult } from './StreamUtils';
export type { RaiseHandCallFeatureState as RaiseHandCallFeature } from './CallClientState';
export type { RaisedHandState } from './CallClientState';
/* @conditional-compile-remove(one-to-n-calling) */
export type { DeclarativeCallAgent, IncomingCallManagement } from './CallAgentDeclarative';
/* @conditional-compile-remove(teams-identity-support) */
export type { DeclarativeTeamsCallAgent } from './TeamsCallAgentDeclarative';
/* @conditional-compile-remove(one-to-n-calling) */
export type { TeamsIncomingCallManagement } from './TeamsCallAgentDeclarative';
export type { LocalVideoStreamVideoEffectsState } from './CallClientState';

export type { CapabilitiesFeatureState } from './CallClientState';
export type { CaptionsCallFeatureState, CaptionsInfo } from './CallClientState';
export type { AcceptedTransfer, TransferFeatureState as TransferFeature } from './CallClientState';
export type { OptimalVideoCountFeatureState } from './CallClientState';
export type { PPTLiveCallFeatureState } from './CallClientState';
export type { ReactionState } from './CallClientState';
export type { SpotlightCallFeatureState, SpotlightState } from './CallClientState';
/* @conditional-compile-remove(local-recording-notification) */
export type { LocalRecordingCallFeatureState } from './CallClientState';
/* @conditional-compile-remove(teams-meeting-conference) */
export type { ConferencePhoneInfo } from './CallClientState';
/* @conditional-compile-remove(breakout-rooms) */
export type { BreakoutRoomsState } from './CallClientState';
