// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export { createStatefulChatClient } from './StatefulChatClient';
export { getCommunicationIdentifierAsKey } from './ChatClientState';

export type { StatefulChatClient, StatefulChatClientArgs, StatefulChatClientOptions } from './StatefulChatClient';
export type { ChatMessageWithStatus, ChatMessageStatus } from './types/ChatMessageWithStatus';
export type {
  ChatClientState,
  ChatThreadClientState,
  ChatThreadProperties,
  CommunicationIdentifierAsKey
} from './ChatClientState';
