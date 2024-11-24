// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export {
  createAzureCommunicationCallAdapter,
  _createAzureCommunicationCallAdapterInner,
  createAzureCommunicationCallAdapterFromClient,
  useAzureCommunicationCallAdapter
} from './AzureCommunicationCallAdapter';

export {
  createTeamsCallAdapter,
  createTeamsCallAdapterFromClient,
  useTeamsCallAdapter
} from './AzureCommunicationCallAdapter';

/* @conditional-compile-remove(teams-identity-support-beta) */
export type { TeamsOutboundCallAdapterArgs, StartTeamsCallIdentifier } from './AzureCommunicationCallAdapter';

export type { TeamsAdapterOptions } from './AzureCommunicationCallAdapter';

export type { TeamsCallAdapterArgsCommon, TeamsCallAdapterArgs } from './AzureCommunicationCallAdapter';

export type { OnFetchProfileCallback, Profile } from './OnFetchProfileCallback';
export type {
  AzureCommunicationCallAdapterArgs,
  CallAdapterLocator,
  AzureCommunicationOutboundCallAdapterArgs
} from './AzureCommunicationCallAdapter';

export type { AzureCommunicationCallAdapterOptions } from './AzureCommunicationCallAdapter';

export type { CommonCallAdapterOptions } from './AzureCommunicationCallAdapter';

/* @conditional-compile-remove(call-participants-locator) */
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

export type { TeamsCallAdapter } from './CallAdapter';

export type { CallingSounds, SoundEffect } from './CallAdapter';
/* @conditional-compile-remove(media-access) */
export type { MediaAccessChangedListener } from './CallAdapter';
/* @conditional-compile-remove(media-access) */
export type { MeetingMediaAccessChangedListener } from './CallAdapter';
