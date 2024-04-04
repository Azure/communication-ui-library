// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export { CallComposite } from './CallComposite';
export type { CallCompositeOptions, CallCompositeProps, RemoteVideoTileMenuOptions } from './CallComposite';
/* @conditional-compile-remove(call-readiness) */
export type { DeviceCheckOptions } from './CallComposite';
export type { LocalVideoTileOptions } from './CallComposite';
export type { CallControlOptions } from './types/CallControlOptions';

export * from './Strings';

export {
  createAzureCommunicationCallAdapter,
  createAzureCommunicationCallAdapterFromClient,
  useAzureCommunicationCallAdapter
} from './adapter';

/* @conditional-compile-remove(teams-identity-support) */
export { createTeamsCallAdapter, createTeamsCallAdapterFromClient, useTeamsCallAdapter } from './adapter';

export type { TeamsAdapterOptions } from './adapter';

/* @conditional-compile-remove(teams-identity-support) */
export type { TeamsCallAdapter, TeamsCallAdapterArgs, Profile, OnFetchProfileCallback } from './adapter';

export type {
  AzureCommunicationCallAdapterArgs,
  CallAdapterLocator,
  CommonCallAdapter,
  CallAdapterCallOperations,
  AzureCommunicationOutboundCallAdapterArgs
} from './adapter';

export type { AzureCommunicationCallAdapterOptions } from './adapter';

export type { CommonCallAdapterOptions } from './adapter';

/* @conditional-compile-remove(teams-adhoc-call) */
export type { CallParticipantsLocator } from './adapter';

export type {
  VideoBackgroundImage,
  VideoBackgroundEffect,
  VideoBackgroundNoEffect,
  VideoBackgroundBlurEffect,
  VideoBackgroundReplacementEffect
} from './adapter/CallAdapter';

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
  ParticipantsLeftListener,
  JoinCallOptions,
  StartCallIdentifier
} from './adapter';

/* @conditional-compile-remove(close-captions) */
export type {
  CaptionsReceivedListener,
  IsCaptionsActiveChangedListener,
  IsCaptionLanguageChangedListener,
  IsSpokenLanguageChangedListener
} from './adapter';

/* @conditional-compile-remove(call-transfer) */
export type { TransferAcceptedListener } from './adapter';

export type { CapabilitiesChangedListener } from './adapter';

export type { CapabilityChangedNotificationStrings } from './components/CapabilitiesChangedNotificationBar';

/* @conditional-compile-remove(spotlight) */
export type { SpotlightChangedListener } from './adapter';

export type { CallingSounds, SoundEffect } from './adapter';

/* @conditional-compile-remove(spotlight) */
export type { SpotlightPromptStrings } from './components/Prompt';
