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
  VideoStreamRendererViewState
} from './CallClientState';
export type { CreateViewResult } from './StreamUtils';
export type { RaiseHandCallFeatureState as RaiseHandCallFeature } from './CallClientState';
export type { RaisedHandState } from './CallClientState';
/* @conditional-compile-remove(one-to-n-calling) */
export type { DeclarativeCallAgent, IncomingCallManagement } from './CallAgentDeclarative';
/* @conditional-compile-remove(one-to-n-calling) */
export type { DeclarativeIncomingCall } from './IncomingCallDeclarative';

export type { LocalVideoStreamVideoEffectsState } from './CallClientState';

export type { CapabilitiesFeatureState } from './CallClientState';
export type { CaptionsCallFeatureState, CaptionsInfo } from './CallClientState';
export type { AcceptedTransfer, TransferFeatureState as TransferFeature } from './CallClientState';
export type { OptimalVideoCountFeatureState } from './CallClientState';
export type { PPTLiveCallFeatureState } from './CallClientState';
export type { ReactionState } from './CallClientState';
/* @conditional-compile-remove(spotlight) */
export type { SpotlightCallFeatureState, SpotlightState } from './CallClientState';
/* @conditional-compile-remove(local-recording-notification) */
export type { LocalRecordingCallFeatureState } from './CallClientState';
