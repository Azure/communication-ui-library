// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export {
  createAzureCommunicationCallAdapter,
  createAzureCommunicationCallAdapterFromClient
} from './AzureCommunicationCallAdapter';
export type { AzureCommunicationCallAdapterArgs, CallAdapterLocator } from './AzureCommunicationCallAdapter';

/* @conditional-compile-remove-from(stable) TEAMS_ADHOC_CALLING */
export type { CallParticipantsLocator } from './AzureCommunicationCallAdapter';

export type {
  CallAdapter,
  CallAdapterCallManagement,
  CallAdapterClientState,
  CallAdapterDeviceManagement,
  CallAdapterState,
  CallAdapterSubscribers,
  CallAdapterUiState,
  CallCompositePage,
  CallEndedListener,
  CallIdChangedListener,
  DiagnosticChangedEventListner,
  DisplayNameChangedListener,
  IsLocalScreenSharingActiveChangedListener,
  IsMutedChangedListener,
  IsSpeakingChangedListener,
  MediaDiagnosticChangedEvent,
  NetworkDiagnosticChangedEvent,
  ParticipantsJoinedListener,
  ParticipantsLeftListener
} from './CallAdapter';
