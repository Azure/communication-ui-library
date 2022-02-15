// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export * from './MeetingComposite';

export type {
  CallWithChatAdapter,
  CallWithChatEvent,
  CallWithChatAdapterManagement,
  CallWithChatAdapterSubscriptions
} from './adapter/MeetingAdapter';

export type {
  AzureCommunicationCallWithChatAdapterArgs,
  CallAndChatLocator
} from './adapter/AzureCommunicationMeetingAdapter';
export { createAzureCommunicationCallWithChatAdapter } from './adapter/AzureCommunicationMeetingAdapter';

export type {
  CallWithChatClientState,
  CallWithChatAdapterUiState,
  CallWithChatAdapterState
} from './state/MeetingAdapterState';

export type { CallWithChatCompositeStrings } from './Strings';
