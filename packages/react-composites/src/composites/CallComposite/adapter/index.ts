// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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

export type { TeamsAdapterOptions } from './AzureCommunicationCallAdapter';
/* @conditional-compile-remove(teams-identity-support) */
export type { TeamsCallAdapterArgs } from './AzureCommunicationCallAdapter';
/* @conditional-compile-remove(teams-identity-support) */
export type { OnFetchProfileCallback, Profile } from './OnFetchProfileCallback';
export type { AzureCommunicationCallAdapterArgs, CallAdapterLocator } from './AzureCommunicationCallAdapter';
/* @conditional-compile-remove(video-background-effects) */
export type { AzureCommunicationCallAdapterOptions } from './AzureCommunicationCallAdapter';
/* @conditional-compile-remove(video-background-effects) */
export type { CommonCallAdapterOptions } from './AzureCommunicationCallAdapter';

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
  ParticipantsLeftListener,
  JoinCallOptions
} from './CallAdapter';

/* @conditional-compile-remove(close-captions) */
export type {
  CaptionsReceivedListener,
  IsCaptionsActiveChangedListener,
  IsCaptionLanguageChangedListener,
  IsSpokenLanguageChangedListener
} from './CallAdapter';

/* @conditional-compile-remove(call-transfer) */
export type { TransferRequestedListener } from './CallAdapter';

/* @conditional-compile-remove(capabilities) */
export type { CapabilitiesChangedListener } from './CallAdapter';

/* @conditional-compile-remove(teams-identity-support) */
export type { TeamsCallAdapter } from './CallAdapter';

export type { CallingSounds, SoundEffect } from './CallAdapter';
