// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export {
  createAzureCommunicationCallAdapter,
  createAzureCommunicationCallAdapterFromClient,
  useAzureCommunicationCallAdapter
} from './AzureCommunicationCallAdapter';
export type { AzureCommunicationCallAdapterArgs, CallAdapterLocator } from './AzureCommunicationCallAdapter';
/* @conditional-compile-remove(rooms) */
export type { AzureCommunicationCallAdapterOptions } from './AzureCommunicationCallAdapter';

/* @conditional-compile-remove(teams-adhoc-call) */
export type { CallParticipantsLocator } from './AzureCommunicationCallAdapter';

export type {
  CallAdapter,
  CallAdapterCallEndedEvent,
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
