// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export {
  createAzureCommunicationCallAdapter,
  createAzureCommunicationCallAdapterFromClient
} from './AzureCommunicationCallAdapter';
export type {
  AzureCommunicationCallAdapterArgs,
  CallAdapterLocator,
  /* @conditional-compile-remove-from(stable) TEAMS_ADHOC_CALLING */ CallParticipantLocator
} from './AzureCommunicationCallAdapter';

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
