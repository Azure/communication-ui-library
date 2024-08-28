// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export {
  createAzureCommunicationCallAdapter,
  _createAzureCommunicationCallAdapterInner,
  createAzureCommunicationCallAdapterFromClient,
  useAzureCommunicationCallAdapter
} from './AzureCommunicationCallAdapter';

/* @conditional-compile-remove(teams-identity-support) */
export {
  createTeamsCallAdapter,
  createTeamsCallAdapterFromClient,
  useTeamsCallAdapter
} from './AzureCommunicationCallAdapter';

/* @conditional-compile-remove(teams-identity-support-beta) */
export type { TeamsOutboundCallAdapterArgs, StartTeamsCallIdentifier } from './AzureCommunicationCallAdapter';

export type { TeamsAdapterOptions } from './AzureCommunicationCallAdapter';
/* @conditional-compile-remove(teams-identity-support) */
export type { TeamsCallAdapterArgsCommon, TeamsCallAdapterArgs } from './AzureCommunicationCallAdapter';

export type { OnFetchProfileCallback, Profile } from './OnFetchProfileCallback';
export type {
  AzureCommunicationCallAdapterArgs,
  CallAdapterLocator,
  AzureCommunicationOutboundCallAdapterArgs
} from './AzureCommunicationCallAdapter';

export type { AzureCommunicationCallAdapterOptions } from './AzureCommunicationCallAdapter';

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
  JoinCallOptions,
  StartCallIdentifier,
  StartCaptionsAdapterOptions,
  StopCaptionsAdapterOptions
} from './CallAdapter';

export type {
  CaptionsReceivedListener,
  IsCaptionsActiveChangedListener,
  IsCaptionLanguageChangedListener,
  IsSpokenLanguageChangedListener
} from './CallAdapter';

export type { TransferAcceptedListener } from './CallAdapter';

export type { CapabilitiesChangedListener } from './CallAdapter';

export type { SpotlightChangedListener } from './CallAdapter';

/* @conditional-compile-remove(teams-identity-support) */
export type { TeamsCallAdapter } from './CallAdapter';

export type { CallingSounds, SoundEffect } from './CallAdapter';
