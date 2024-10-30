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
export type { TeamsIncomingCallState } from './CallClientState';
/* @conditional-compile-remove(remote-ufd) */
export type { RemoteDiagnosticState, RemoteDiagnosticType } from './CallClientState';
export type { CreateViewResult } from './StreamUtils';
export type { RaiseHandCallFeatureState as RaiseHandCallFeature } from './CallClientState';
/* @conditional-compile-remove(together-mode) */
export type { TogetherModeCallFeatureState as TogetherModeCallFeature } from './CallClientState';
/* @conditional-compile-remove(together-mode) */
export type { TogetherModeStreamState } from './CallClientState';
export type { RaisedHandState } from './CallClientState';
export type { DeclarativeCallAgent, IncomingCallManagement } from './CallAgentDeclarative';
export type { DeclarativeTeamsCallAgent } from './TeamsCallAgentDeclarative';
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
export type { ConferencePhoneInfo } from './CallClientState';
/* @conditional-compile-remove(breakout-rooms) */
export type { BreakoutRoomsState } from './CallClientState';
/* @conditional-compile-remove(media-access) */
export type { MediaAccessState } from './CallClientState';
