// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export { createStatefulChatClient } from './StatefulChatClient';
export { getCommunicationIdentifierAsKey } from './ChatClientState';

export type { StatefulChatClient } from './StatefulChatClient';
export type { ChatMessageWithStatus, ChatMessageStatus } from './types/ChatMessageWithStatus';
export type { ChatConfig } from './types/ChatConfig';
export type {
  ChatClientState,
  ChatThreadClientState,
  ChatThreadProperties,
  CommunicationIdentifierAsKey
} from './ChatClientState';
