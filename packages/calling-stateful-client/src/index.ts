// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export { createStatefulCallClient } from './StatefulCallClient';
export type { StatefulCallClient, StatefulCallClientArgs, StatefulCallClientOptions } from './StatefulCallClient';
export type { StatefulDeviceManager } from './DeviceManagerDeclarative';
export type {
  Call,
  CallAgent,
  CallClientState,
  DeviceManagerState,
  IncomingCall,
  LocalVideoStream,
  RemoteParticipant,
  RemoteVideoStream,
  VideoStreamRendererView,
  RecordingCallFeature,
  TranscriptionCallFeature,
  Transfer,
  TransferCallFeature,
  TransferRequest
} from './CallClientState';
export { getRemoteParticipantKey } from './Converter';
