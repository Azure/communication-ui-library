// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export * from './MeetingComposite';

export type {
  CallAndChatAdapter,
  CallAndChatEvent,
  CallAndChatAdapterManagement,
  CallAndChatAdapterSubscriptions
} from './adapter/MeetingAdapter';

export type {
  AzureCommunicationCallAndChatAdapterArgs,
  CallAndChatLocator
} from './adapter/AzureCommunicationMeetingAdapter';
export { createAzureCommunicationCallAndChatAdapter } from './adapter/AzureCommunicationMeetingAdapter';

export type {
  CallAndChatClientState,
  CallAndChatAdapterUiState,
  CallAndChatAdapterState
} from './state/MeetingAdapterState';

export type { CallAndChatCompositeStrings } from './Strings';
