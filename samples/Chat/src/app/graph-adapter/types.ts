// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  ChatClient,
  ChatMessage,
  ChatMessageReadReceipt,
  ChatParticipant,
  ChatThreadClient,
  ChatThreadProperties
} from '@azure/communication-chat';

export type PublicInterface<T> = { [K in keyof T]: T[K] };

export type IChatClient = PublicInterface<ChatClient>;

export type IChatThreadClient = PublicInterface<ChatThreadClient>;

export interface Thread extends ChatThreadProperties {
  version: number;
  participants: ChatParticipant[];
  messages: ChatMessage[];
  readReceipts: ChatMessageReadReceipt[];
}
