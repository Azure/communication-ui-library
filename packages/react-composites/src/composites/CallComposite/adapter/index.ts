// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export {
  createAzureCommunicationCallAdapter,
  createAzureCommunicationCallAdapterFromClient,
  useAzureCommunicationCallAdapter
} from './AzureCommunicationCallAdapter';

/* @conditional-compile-remove(teams-identity-support) */
export {
  createTeamsCallAdapter,
  createTeamsCallAdapterFromClient,
  useTeamsCallAdapter
} from './AzureCommunicationCallAdapter';
/* @conditional-compile-remove(teams-identity-support) */
export type { TeamsCallAdapterArgs, TeamsAdapterOptions } from './AzureCommunicationCallAdapter';
/* @conditional-compile-remove(teams-identity-support) */
export type { OnFetchProfileCallback, Profile } from './OnFetchProfileCallback';
export type { AzureCommunicationCallAdapterArgs, CallAdapterLocator } from './AzureCommunicationCallAdapter';
/* @conditional-compile-remove(rooms) */
export type { AzureCommunicationCallAdapterOptions } from './AzureCommunicationCallAdapter';

/* @conditional-compile-remove(teams-adhoc-call) */
export type { CallParticipantsLocator } from './AzureCommunicationCallAdapter';

export type {
  CallAdapter,
  CommonCallAdapter,
  CallAdapterCallEndedEvent,
  CallAdapterCallManagement,
  CallAdapterCallOperations,
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

/* @conditional-compile-remove(close-captions) */
export type { CaptionsReceivedListener } from './CallAdapter';

/* @conditional-compile-remove(teams-identity-support) */
export type { TeamsCallAdapter } from './CallAdapter';
