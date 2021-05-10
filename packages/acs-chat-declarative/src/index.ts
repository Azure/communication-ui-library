// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export { chatClientDeclaratify } from './ChatClientDeclarative';
export { getCommunicationIdentifierAsKey } from './ChatClientState';
export { ChatContext } from './ChatContext';
export { chatThreadClientDeclaratify } from './ChatThreadClientDeclarative';

export type { DeclarativeChatClient } from './ChatClientDeclarative';
export type { ChatMessageWithStatus, ChatMessageStatus } from './types/ChatMessageWithStatus';
export type { ChatConfig } from './types/ChatConfig';
export type { TypingIndicatorEvent } from './types/TypingIndicatorEvent';
export type {
  ChatClientState,
  ChatThreadClientState,
  ChatThreadProperties,
  CommunicationIdentifierAsKey
} from './ChatClientState';
