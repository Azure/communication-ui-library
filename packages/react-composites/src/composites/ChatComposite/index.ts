// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export { createAzureCommunicationChatAdapter } from './adapter/AzureCommunicationChatAdapter';

export { ChatComposite } from './ChatComposite';

export type { ChatCompositeProps, ChatOptions } from './ChatComposite';

export type {
  ChatAdapter,
  ChatCompositeClientState,
  ChatState,
  ChatUIState,
  MessageReadListener,
  MessageReceivedListener,
  MessageSentListener,
  ParticipantsAddedListener,
  ParticipantsRemovedListener,
  TopicChangedListener
} from './adapter/ChatAdapter';
