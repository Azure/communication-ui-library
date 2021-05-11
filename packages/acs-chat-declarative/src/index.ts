// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export { createStatefulChatClient } from './ChatClientDeclarative';
export { getCommunicationIdentifierAsKey } from './ChatClientState';

export type { StatefulChatClient } from './ChatClientDeclarative';
export type { ChatMessageWithStatus, ChatMessageStatus } from './types/ChatMessageWithStatus';
export type { ChatConfig } from './types/ChatConfig';
export type { TypingIndicatorEvent } from './types/TypingIndicatorEvent';
export type {
  ChatClientState,
  ChatThreadClientState,
  ChatThreadProperties,
  CommunicationIdentifierAsKey
} from './ChatClientState';
