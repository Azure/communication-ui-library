// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export { CallComposite } from './CallComposite';
export type { CallCompositeOptions, CallCompositeProps, RemoteVideoTileMenuOptions } from './CallComposite';
/* @conditional-compile-remove(call-readiness) */
export type { DeviceCheckOptions } from './CallComposite';
export type { LocalVideoTileOptions } from './CallComposite';
export type { CallControlOptions } from './types/CallControlOptions';
export type { DtmfDialPadOptions } from './CallComposite';
export type { NotificationStackOptions } from './CallComposite';

export * from './Strings';

export {
  createAzureCommunicationCallAdapter,
  createAzureCommunicationCallAdapterFromClient,
  useAzureCommunicationCallAdapter
} from './adapter';

export { createTeamsCallAdapter, createTeamsCallAdapterFromClient, useTeamsCallAdapter } from './adapter';

export type { TeamsAdapterOptions } from './adapter';

export type { TeamsCallAdapterArgsCommon, TeamsCallAdapter, TeamsCallAdapterArgs } from './adapter';
/* @conditional-compile-remove(teams-identity-support-beta) */
export type { TeamsOutboundCallAdapterArgs, StartTeamsCallIdentifier } from './adapter';

export type { Profile, OnFetchProfileCallback } from './adapter';

export type {
  AzureCommunicationCallAdapterArgs,
  CallAdapterLocator,
  CommonCallAdapter,
  CallAdapterCallOperations,
  AzureCommunicationOutboundCallAdapterArgs
} from './adapter';

export type { AzureCommunicationCallAdapterOptions } from './adapter';

export type { CommonCallAdapterOptions } from './adapter';

/* @conditional-compile-remove(call-participants-locator) */
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
  StartCallIdentifier,
  StartCaptionsAdapterOptions,
  StopCaptionsAdapterOptions
} from './adapter';

export type {
  CaptionsReceivedListener,
  IsCaptionsActiveChangedListener,
  IsCaptionLanguageChangedListener,
  IsSpokenLanguageChangedListener
} from './adapter';

/* @conditional-compile-remove(rtt) */
export type { RealTimeTextReceivedListener } from './adapter';

export type { TransferAcceptedListener } from './adapter';

export type { CapabilitiesChangedListener } from './adapter';

export type { CapabilityChangedNotificationStrings } from './components/CapabilitiesChangedNotificationBar';

export type { SpotlightChangedListener } from './adapter';

export type { CallingSounds, SoundEffect } from './adapter';

export type { SpotlightPromptStrings } from './components/Prompt';
