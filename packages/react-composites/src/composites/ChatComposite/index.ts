// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export { createAzureCommunicationChatAdapter } from './adapter/AzureCommunicationChatAdapter';
export type { AzureCommunicationChatAdapterArgs } from './adapter/AzureCommunicationChatAdapter';

export { ChatComposite } from './ChatComposite';
export type { ChatCompositeProps, ChatCompositeVisualElements } from './ChatComposite';

export type {
  ChatAdapter,
  ChatAdapterErrors,
  ChatAdapterSubscribers,
  ChatAdapterThreadManagement,
  ChatCompositeClientState,
  ChatAdapterState,
  ChatAdapterUiState,
  ChatErrorListener,
  MessageReadListener,
  MessageReceivedListener,
  MessageSentListener,
  ParticipantsAddedListener,
  ParticipantsRemovedListener,
  TopicChangedListener
} from './adapter/ChatAdapter';
