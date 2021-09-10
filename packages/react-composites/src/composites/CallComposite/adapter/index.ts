// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export { createAzureCommunicationCallAdapter } from './AzureCommunicationCallAdapter';
export type { AzureCommunicationCallAdapterArgs } from './AzureCommunicationCallAdapter';

export type {
  CallAdapter,
  CallAdapterClientState,
  CallAdapterState,
  CallAdapterUiState,
  CallAdapterCallManagement,
  CallAdapterDeviceManagement,
  CallAdapterSubscribers,
  CallCompositePage,
  CallEndedListener,
  CallIdChangedListener,
  DisplayNameChangedListener,
  IncomingCallListener,
  IsMuteChangedListener,
  IsScreenSharingOnChangedListener,
  IsSpeakingChangedListener,
  ParticipantJoinedListener,
  ParticipantLeftListener
} from './CallAdapter';
