// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export { CallComposite } from './CallComposite';
export type { CallCompositeOptions, CallCompositeProps } from './CallComposite';
/* @conditional-compile-remove(call-readiness) */
export type { DevicePermissionRestrictions } from './CallComposite';
export type { CallControlDisplayType, CallControlOptions } from './types/CallControlOptions';
/* @conditional-compile-remove(control-bar-button-injection) */
export type {
  CustomCallControlButtonPlacement,
  CustomCallControlButtonCallback,
  CustomCallControlButtonCallbackArgs,
  CustomCallControlButtonProps,
  CustomControlButtonProps
} from './types/CallControlOptions';

export * from './Strings';

export {
  createAzureCommunicationCallAdapter,
  createAzureCommunicationCallAdapterFromClient,
  useAzureCommunicationCallAdapter
} from './adapter';
export type {
  AzureCommunicationCallAdapterArgs,
  CallAdapterLocator,
  CommonCallAdapter,
  CallAdapterCallOperations
} from './adapter';

/* @conditional-compile-remove(rooms) */
export type { AzureCommunicationCallAdapterOptions } from './adapter';

/* @conditional-compile-remove(teams-adhoc-call) */
export type { CallParticipantsLocator } from './adapter';

/* @conditional-compile-remove(unsupported-browser) */
export type { CallAdapterOptionalFeatures } from './adapter';

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
} from './adapter';
