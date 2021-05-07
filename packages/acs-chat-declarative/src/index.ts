// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export { chatClientDeclaratify } from './ChatClientDeclarative';
export { communicationIdentifierAsKey } from './ChatClientState';
export { ChatContext } from './ChatContext';
export { chatThreadClientDeclaratify } from './ChatThreadClientDeclarative';

export type { DeclarativeChatClient } from './ChatClientDeclarative';
export type { ChatMessageWithStatus, MessageStatus } from './types/ChatMessageWithStatus';
export type { ChatConfig } from './types/ChatConfig';
export type { ReadReceipt } from './types/ReadReceipt';
export type { TypingIndicator } from './types/TypingIndicator';
export type {
  ChatClientState,
  ChatThreadClientState,
  ChatThreadProperties,
  CommunicationIdentifierAsKey
} from './ChatClientState';
